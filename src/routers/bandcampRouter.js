const bandcamp = require('../scraper/lib/index');
const router = require('express').Router();
const cacheMiddleware = require('../middleware/cacheMiddleware');

router.get('/search', cacheMiddleware, async (req, res) => {
  const { query, page } = req.query;
  const params = { query, page: Number(page) };
  return res.status(201).json({ message: 'All good here' });
  // try {
  //   const results = await bandcamp.search(params);
  //   const filteredResults = results
  //     .filter(({ type }) => !['fan', 'label'].includes(type))
  //     .filter(({ imageUrl }) => imageUrl != null);

  //   return res.status(201).json({ results: filteredResults, total: filteredResults.length });
  // } catch (error) {
  //   return res.status(500).json({ message: 'Error loading artists' });
  // }
});

router.get('/albums', async (req, res) => {
  const { artistUrl } = req.query;
  try {
    const albumUrls = await bandcamp.getAlbumUrls(artistUrl);
    const albums = await Promise.all(albumUrls.map((albumUrl) => bandcamp.getAlbumInfo(albumUrl)));
    return res.status(201).json({ results: albums, total: albums.length });
  } catch (error) {
    return res.status(500).json({ message: 'Error loading albums' });
  }
});

module.exports = router;
