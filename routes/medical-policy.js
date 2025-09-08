const {
  save, getAll, patch, deleted,
} = require('../controllers/medical-policy');

module.exports = (router) => {
  router.post('/medical-policy', save);
  router.get('/medical-policy', getAll);
  router.patch('/medical-policy/:publicId', patch);
  router.delete('/medical-policy/:publicId', deleted);
};
