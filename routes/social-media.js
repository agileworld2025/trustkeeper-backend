const {
  save, getAll, update, deleted,
} = require('../controllers/social-media');

module.exports = (router) => {
  router.post('/social-media', save);
  router.get('/social-media', getAll);
  router.patch('/social-media/:publicId', update);
  router.delete('/social-media/:publicId', deleted);
};
