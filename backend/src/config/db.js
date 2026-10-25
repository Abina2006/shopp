import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Shared Prisma client with connection retry for Neon DB auto-suspend recovery.
 * Neon free tier suspends after 5 min of inactivity — this handles the cold-start delay.
 */
let basePrisma;

const clientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  ...(process.env.DATABASE_URL ? {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  } : {}),
};

if (process.env.NODE_ENV === 'production') {
  basePrisma = new PrismaClient(clientOptions);
} else {
  // Prevent multiple clients during hot-reload in development
  if (!global.__basePrisma) {
    global.__basePrisma = new PrismaClient(clientOptions);
  }
  basePrisma = global.__basePrisma;
}

// Wrap Prisma with automatic query retry logic for Neon serverless cold starts
const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        let retries = 4;
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            return await query(args);
          } catch (error) {
            const isConnError =
              error?.code === 'P1001' ||
              (error?.message && (
                error.message.includes("Can't reach database server") ||
                error.message.includes("Connection terminated") ||
                error.message.includes("connection timeout") ||
                error.message.includes("ETIMEDOUT") ||
                error.message.includes("ECONNRESET")
              ));

            if (isConnError && attempt < retries) {
              console.warn(
                `⚠️ [Prisma Auto-Retry] ${model}.${operation} failed attempt ${attempt}/${retries}: ${error.message}. Retrying in 2s (waiting for Neon database to wake)...`
              );
              await new Promise((r) => setTimeout(r, 2000));
            } else {
              throw error;
            }
          }
        }
      },
    },
  },
});

/**
 * Connects to the database with exponential back-off retry.
 * Neon DB may take up to 10s to wake from suspend.
 */
export async function connectWithRetry(maxRetries = 5, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await basePrisma.$connect();
      console.log('✅ Database connected successfully');
      startKeepAlivePing();
      return;
    } catch (err) {
      console.warn(`⚠️  DB connect attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt === maxRetries) {
        console.error('❌ Could not connect to database after all retries. Continuing without DB...');
        return; // Don't crash — let individual queries fail gracefully
      }
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
}

/**
 * Periodically pings Neon DB every 4 minutes to prevent auto-suspend during active dev sessions.
 */
function startKeepAlivePing() {
  if (global.__neonPingInterval) return;
  global.__neonPingInterval = setInterval(async () => {
    try {
      await basePrisma.$queryRaw`SELECT 1`;
    } catch {
      // Ignore keep-alive errors silently
    }
  }, 4 * 60 * 1000);
}

export default prisma;
