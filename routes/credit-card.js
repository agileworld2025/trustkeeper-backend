const {
  save, getAll, patch, deleted,
} = require('../controllers/credit-card');

module.exports = (router) => {
  router.post('/credit-card', save);
  router.get('/credit-card', getAll);
  router.patch('/credit-card/:publicId', patch);
  router.delete('/credit-card/:publicId', deleted);
};
