const {
  save, getAll, update, deleted,
} = require('../controllers/email-account');

module.exports = (router) => {
  router.post('/email-account', save);
  router.get('/email-account', getAll);
  router.patch('/email-account/:publicId', update);
  router.delete('/email-account/:publicId', deleted);
};
