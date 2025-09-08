const {
  save, getAll, update, deleted,
} = require('../controllers/trust');

module.exports = (router) => {
  router.post('/trust', save);
  router.get('/trust', getAll);
  router.patch('/trust/:publicId', update);
  router.delete('/trust/:publicId', deleted);
};
