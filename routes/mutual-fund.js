const {
  save, getAll, patch, deleted,
} = require('../controllers/mutual-fund');

module.exports = (router) => {
  router.post('/mutual-fund', save);
  router.get('/mutual-fund', getAll);
  router.patch('/mutual-fund/:publicId', patch);
  router.delete('/mutual-fund/:publicId', deleted);
};
