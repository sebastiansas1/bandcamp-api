const memoryCache = require('memory-cache');

const cache = new memoryCache.Cache();

const createKey = (req) => `__express__${req.originalUrl || req.url}`;

class BandcampCache {
  constructor() {
    this.cache = cache;
  }

  put(req, value) {
    const key = createKey(req);
    this.cache.put(key, value);
  }

  get(req) {
    const key = createKey(req);
    return this.cache.get(key);
  }

  exists(req) {
    const key = createKey(req);
    return this.cache.get(key) != null;
  }
}

module.exports = BandcampCache;
