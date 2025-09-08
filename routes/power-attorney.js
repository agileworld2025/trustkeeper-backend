const {
  save, getAll, update, deleted,
} = require('../controllers/power-attorney');

module.exports = (router) => {
  router.post('/power-attorney', save);
  router.get('/power-attorney', getAll);
  router.patch('/power-attorney/:publicId', update);
  router.delete('/power-attorney/:publicId', deleted);
};
