const {
  save, getAll, update, deleted,
} = require('../controllers/cloud-storage');

module.exports = (router) => {
  router.post('/cloud-storage', save);
  router.get('/cloud-storage', getAll);
  router.patch('/cloud-storage/:publicId', update);
  router.delete('/cloud-storage/:publicId', deleted);
};
