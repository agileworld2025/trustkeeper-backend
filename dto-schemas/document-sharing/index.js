const shareDocument = require('./share-document');
const getSharedDocuments = require('./get-shared-documents');
const getDocumentByToken = require('./get-document-by-token');
const revokeSharing = require('./revoke-sharing');
const getSharedAssetsByEmail = require('./get-shared-assets-by-email');
const addFamilyMember = require('./add-family-member');

module.exports = {
  shareDocument,
  getSharedDocuments,
  getDocumentByToken,
  revokeSharing,
  getSharedAssetsByEmail,
  addFamilyMember,
};
