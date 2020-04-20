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
    console.log(`Memory cache entries increased to ---> ${cache.memSize()}`);
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
    console.log(`Memory cache entries increased to ---> ${cache.memSize()}`);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error loading albums' });
  }
});

router.get('/tracks', cacheMiddleware, async (req, res) => {
  const { albumUrl } = req.query;
  try {
    const tracks = await bandcamp.getAlbumInfo(albumUrl);
    const data = { results: tracks, total: tracks.length };
    cache.put(req, data);
    console.log(`Memory cache entries increased to ---> ${cache.memSize()}`);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error loading tracks' });
  }
});

router.get('/collate', cacheMiddleware, async (req, res) => {
  const { albumName, artistName } = req.query;
  const params = { query: albumName, page: 1 };
  try {
    const results = await bandcamp.search(params);
    const filteredResults = results.filter(({ type, artist }) => ['album'].includes(type));
    const firstResult = filteredResults[0];
    const tracks = await bandcamp.getAlbumInfo(firstResult.url);
    const data = { results: tracks, total: tracks.length };
    cache.put(req, data);
    console.log(`Memory cache entries increased to ---> ${cache.memSize()}`);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Error loading tracks' });
  }
});

module.exports = router;
