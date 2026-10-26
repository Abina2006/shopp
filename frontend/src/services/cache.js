/**
 * Lightweight in-memory API cache
 * Caches API responses for a configurable TTL (default 2 minutes)
 */

const cache = new Map();
const DEFAULT_TTL = 2 * 60 * 1000; // 2 minutes

export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached(key, data, ttl = DEFAULT_TTL) {
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

export function clearCache(keyPrefix = null) {
  if (!keyPrefix) { cache.clear(); return; }
  for (const key of cache.keys()) {
    if (key.startsWith(keyPrefix)) cache.delete(key);
  }
}

/**
 * Cached API GET wrapper
 * Usage: const data = await cachedGet(api, '/products/smart-search', { params }, 60000)
 */
export async function cachedGet(apiInstance, url, config = {}, ttl = DEFAULT_TTL) {
  const cacheKey = url + JSON.stringify(config.params || {});
  const cached = getCached(cacheKey);
  if (cached) return cached;
  const response = await apiInstance.get(url, config);
  setCached(cacheKey, response, ttl);
  return response;
}
