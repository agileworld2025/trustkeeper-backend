const {
  save, getAll, update, deleted,
} = require('../controllers/streaming-services');

module.exports = (router) => {
  router.post('/streaming-services', save);
  router.get('/streaming-services', getAll);
  router.patch('/streaming-services/:publicId', update);
  router.delete('/streaming-services/:publicId', deleted);
};
