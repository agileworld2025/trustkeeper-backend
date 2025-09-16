const {
  save, getAll, patch, deleted,
} = require('../controllers/business-ownership');
const { upload } = require('../utils/upload');

module.exports = (router) => {
  router.post('/business-ownership', upload.array('businessDocuments', 10), save);
  router.get('/business-ownership', getAll);
  router.patch('/business-ownership/:publicId', upload.array('businessDocuments', 10), patch);
  router.delete('/business-ownership/:publicId', deleted);
};
