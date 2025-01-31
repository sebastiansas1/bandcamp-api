const req = require('tinyreq');
const urlHelper = require('url');
const htmlParser = require('./htmlParser.js');
const utils = require('./utils.js');

exports.search = (params) =>
  new Promise((resolve, reject) => {
    req(utils.generateSearchUrl(params), (error, html) => {
      if (error) return reject(error);
      return resolve(htmlParser.parseSearchResults(html));
    });
  });

exports.getAlbumsWithTag = (params) =>
  new Promise((resolve, reject) => {
    req(utils.generateTagUrl(params), (error, html) => {
      if (error) return reject(error);
      return resolve(htmlParser.parseTagResults(html));
    });
  });

exports.getAlbumUrls = (artistUrl) =>
  new Promise((resolve, reject) => {
    req(urlHelper.resolve(artistUrl, '/music'), (error, html) => {
      if (error) return reject(error);
      return resolve(htmlParser.parseAlbumUrls(html, artistUrl));
    });
  });

exports.getAlbumInfo = (albumUrl) =>
  new Promise((resolve, reject) => {
    req(albumUrl, (error, html) => {
      if (error) return reject(error);
      return resolve(htmlParser.parseAlbumInfo(html, albumUrl));
    });
  });

exports.getAlbumProducts = (albumUrl) =>
  new Promise((resolve, reject) => {
    req(albumUrl, (error, html) => {
      if (error) return reject(error);
      return resolve(htmlParser.parseAlbumProducts(html, albumUrl));
    });
  });
