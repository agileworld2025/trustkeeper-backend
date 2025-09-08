const {
  save, getAll, patch, deleted,
} = require('../controllers/fixed-deposit');

module.exports = (router) => {
  router.post('/fixed-deposit', save);
  router.get('/fixed-deposit', getAll);
  router.patch('/fixed-deposit/:publicId', patch);
  router.delete('/fixed-deposit/:publicId', deleted);
};
