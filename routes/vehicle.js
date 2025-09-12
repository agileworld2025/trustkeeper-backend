const {
  save, getAll, patch, deleted,
} = require('../controllers/vehicle');
const { upload } = require('../utils/upload');

module.exports = (router) => {
  router.post('/vehicle', upload.single('image'), save);
  router.get('/vehicle', getAll);
  router.patch('/vehicle/:publicId', upload.single('image'), patch);
  router.delete('/vehicle/:publicId', deleted);
};
