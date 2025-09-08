const {
  save, getAll, update, deleted,
} = require('../controllers/legal-advisor');

module.exports = (router) => {
  router.post('/legal-advisor', save);
  router.get('/legal-advisor', getAll);
  router.patch('/legal-advisor/:publicId', update);
  router.delete('/legal-advisor/:publicId', deleted);
};
