const {
  save, update, getAll, deleted,
} = require('../controllers/tax-details');

module.exports = (router) => {
  router.post('/tax-details', save);
  router.get('/tax-details', getAll);
  router.patch('/tax-details/:publicId', update);
  router.delete('/tax-details/:publicId', deleted);
};
