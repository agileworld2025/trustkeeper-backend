const DocumentSharingController = require('../controllers/document-sharing');

module.exports = (router) => {
  // Document sharing routes
  router.post('/document-sharing/share', DocumentSharingController.shareDocument);
  router.post('/document-sharing/share-with-trustkeeper', DocumentSharingController.shareDocumentWithTrustKeeper);
  router.get('/document-sharing/my-shares', DocumentSharingController.getSharedDocuments);
  router.get('/document-sharing/stats', DocumentSharingController.getSharingStats);
  router.post('/document-sharing/revoke', DocumentSharingController.revokeSharing);
  router.get('/document-sharing/view/:token', DocumentSharingController.getDocumentByToken);

  // Shared assets routes (consolidated)
  router.get('/shared-assets/my-assets', DocumentSharingController.getSharedAssets);
  router.get('/shared-assets/summary', DocumentSharingController.getSharedAssetsSummary);
  router.post('/shared-assets/by-email', DocumentSharingController.getSharedAssetsByEmail);
  router.post('/shared-assets/check-app-status', DocumentSharingController.checkUserAppStatus);
  router.post('/shared-assets/send-download-notification', DocumentSharingController.sendAppDownloadNotification);
  router.post('/shared-assets/for-app', DocumentSharingController.getSharedAssetsForApp);
  router.get('/shared-assets/trustkeeper-interface', DocumentSharingController.getTrustKeeperSharingInterface);
};
