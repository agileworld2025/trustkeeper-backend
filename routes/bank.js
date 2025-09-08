const {
  save, getAll, patch, deleted,
} = require('../controllers/bank');
const { upload } = require('../utils/upload');

module.exports = (router) => {
  router.post('/bank', upload.single('image'), save);
  router.get('/bank', getAll);
  router.patch('/bank/:publicId', patch);
  router.delete('/bank/:publicId', deleted);
};
