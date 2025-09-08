const {
  save, getAll, patch, deleted,
} = require('../controllers/crypto');

module.exports = (router) => {
  router.post('/crypto', save);
  router.get('/crypto', getAll);
  router.patch('/crypto/:publicId', patch);
  router.delete('/crypto/:publicId', deleted);
};
