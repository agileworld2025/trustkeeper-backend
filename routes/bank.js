const {
  save, getAll, update, deleted,
} = require('../controllers/bank');
const { upload } = require('../utils/upload');

module.exports = (router) => {
  router.post('/bank', upload.single('image'), save);
  router.get('/bank', getAll);
  router.patch('/bank/:publicId', update);
  router.delete('/bank/:publicId', deleted);
};
