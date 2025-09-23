const DocumentSharingController = require('../controllers/document-sharing');
const SharedAssetsController = require('../controllers/shared-assets');

module.exports = (router) => {
  router.post('/document-sharing/share', DocumentSharingController.shareDocument);
  router.post('/document-sharing/share-with-trustkeeper', DocumentSharingController.shareDocumentWithTrustKeeper);
  router.get('/document-sharing/my-shares', DocumentSharingController.getSharedDocuments);
  router.get('/document-sharing/stats', DocumentSharingController.getSharingStats);
  router.post('/document-sharing/revoke', DocumentSharingController.revokeSharing);
  router.get('/document-sharing/view/:token', DocumentSharingController.getDocumentByToken);
  router.get('/shared-assets/my-assets', SharedAssetsController.getSharedAssets);
  router.get('/shared-assets/summary', SharedAssetsController.getSharedAssetsSummary);
  router.post('/shared-assets/by-email', SharedAssetsController.getSharedAssetsByEmail);
  router.post('/shared-assets/check-app-status', SharedAssetsController.checkUserAppStatus);
  router.post('/shared-assets/send-download-notification', SharedAssetsController.sendAppDownloadNotification);
  router.post('/shared-assets/for-app', SharedAssetsController.getSharedAssetsForApp);
};
