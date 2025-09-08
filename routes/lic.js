const {
  save, getAll, patch, deleted,
} = require('../controllers/lic');

module.exports = (router) => {
  router.post('/lic', save);
  router.get('/lic', getAll);
  router.patch('/lic/:publicId', patch);
  router.delete('/lic/:publicId', deleted);
};
