const {
  save, getAll, patch, deleted,
} = require('../controllers/term-insurance');

module.exports = (router) => {
  router.post('/term-insurance', save);
  router.get('/term-insurance', getAll);
  router.patch('/term-insurance/:publicId', patch);
  router.delete('/term-insurance/:publicId', deleted);
};
