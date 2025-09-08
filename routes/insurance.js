const {
  save, getAll, patch, deleted,
} = require('../controllers/insurance');

module.exports = (router) => {
  router.post('/insurance', save);
  router.get('/insurance', getAll);
  router.patch('/insurance/:publicId', patch);
  router.delete('/insurance/:publicId', deleted);
};
