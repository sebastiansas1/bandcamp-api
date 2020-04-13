const memoryCache = require('memory-cache');

const cache = new memoryCache.Cache();
const createKey = (req) => `__express__${req.originalUrl || req.url}`;

const DEFAULT_CACHE_RETENTION_TIME = 60 * 60 * 24 * 30;

class BandcampCache {
  constructor() {
    this.cache = cache;
  }

  put(req, value) {
    const key = createKey(req);
    this.cache.put(key, value, DEFAULT_CACHE_RETENTION_TIME);
  }

  get(req) {
    const key = createKey(req);
    return this.cache.get(key);
  }

  memSize() {
    return this.cache.size();
  }

  exists(req) {
    const key = createKey(req);
    return this.cache.get(key) != null;
  }
}

module.exports = BandcampCache;
