const { addFamilyMember, getFamilyMembers } = require('../controllers/share-family');

module.exports = (router) => {
  router.post('/share-family/add-family-member', addFamilyMember);
  router.get('/share-family/get-family-members', getFamilyMembers);
};
