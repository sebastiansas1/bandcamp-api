const BandcampCache = require('../cache/BandcampCache');

const cache = new BandcampCache();

module.exports = (req, res, next) => {
  if (cache.exists(req)) return res.status(201).json(cache.get(req));
  next();
};
