const { addFamilyMember } = require('../controllers/share-family');

module.exports = (router) => {
  router.post('/share-family/add-family-member', addFamilyMember);
};
