const {
  save, getAll, update, deleted,
} = require('../controllers/loan-details');

module.exports = (router) => {
  router.post('/loan-details', save);
  router.get('/loan-details', getAll);
  router.patch('/loan-details/:publicId', update);
  router.delete('/loan-details/:publicId', deleted);
};
