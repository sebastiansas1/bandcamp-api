const bandcamp = require('../scraper/lib/index');
const router = require('express').Router();
const cacheMiddleware = require('../middleware/cacheMiddleware');
const BandcampCache = require('../cache/BandcampCache');

const cache = new BandcampCache();

router.get('/search', cacheMiddleware, async (req, res) => {
  const { query, page } = req.query;
  const params = { query, page: Number(page) };

  try {
    const results = await bandcamp.search(params);
    const filteredResults = results
      .filter(({ type }) => !['fan', 'label'].includes(type))
      .filter(({ imageUrl }) => imageUrl != null);

    const data = { results: filteredResults, total: filteredResults.length };
    cache.put(req, data);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error loading artists' });
  }
});

router.get('/albums', cacheMiddleware, async (req, res) => {
  const { artistUrl } = req.query;
  try {
    const albumUrls = await bandcamp.getAlbumUrls(artistUrl);
    const albums = await Promise.all(albumUrls.map((albumUrl) => bandcamp.getAlbumInfo(albumUrl)));
    const data = { results: albums, total: albums.length };
    cache.put(req, data);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error loading albums' });
  }
});

module.exports = router;
