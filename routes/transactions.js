const { save, getAll } = require('../controllers/transactions');

module.exports = (router) => {
  router.post('/transactions', save);
  router.get('/transactions', getAll);
};
