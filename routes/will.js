const {
  save, getAll, update, deleted,
} = require('../controllers/will');

module.exports = (router) => {
  router.post('/will', save);
  router.get('/will', getAll);
  router.patch('/will/:publicId', update);
  router.delete('/will/:publicId', deleted);
};
