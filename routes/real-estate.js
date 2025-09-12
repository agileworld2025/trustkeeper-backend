const {
  save, getAll, patch, deleted,
} = require('../controllers/real-estate');
const { upload } = require('../utils/upload');

module.exports = (router) => {
  router.post('/real-estate', upload.single('image'), save);
  router.get('/real-estate', getAll);
  router.patch('/real-estate/:publicId', upload.single('image'), patch);
  router.delete('/real-estate/:publicId', deleted);
};
