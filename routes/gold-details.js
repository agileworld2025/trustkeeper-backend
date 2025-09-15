const {
  save, getAll, patch, deleted,
} = require('../controllers/gold-details');
const { upload } = require('../utils/upload');

module.exports = (router) => {
  router.post('/gold', upload.single('document'), save);
  router.get('/gold', getAll);
  router.patch('/gold/:publicId', upload.single('document'), patch);
  router.delete('/gold/:publicId', deleted);
};
