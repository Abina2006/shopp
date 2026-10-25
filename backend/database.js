import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// PostgreSQL pool using .env parameters or connectionString
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'shopwiseAI',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {})
});

// Handle idle pool resets silently
pool.on('error', (err) => {
  if (err.message.includes('closed') || err.message.includes('terminated')) {
    return;
  }
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

// Auto-test PostgreSQL connection with retries for Neon wake-up
async function initPgPool(retries = 3) {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log('PostgreSQL connected successfully');
      client.release();
      return;
    } catch (err) {
      if (i === retries) {
        console.warn('⚠️  PostgreSQL pool initial connection deferred:', err.message);
      } else {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
}
initPgPool();

export default pool;
