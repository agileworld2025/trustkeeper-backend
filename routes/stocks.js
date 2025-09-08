const {
  save, patch, getAll, deleted,
} = require('../controllers/stocks');

module.exports = (router) => {
  router.post('/stocks', save);
  router.get('/stocks', getAll);
  router.patch('/stocks/:publicId', patch);
  router.delete('/stocks/:publicId', deleted);
};
