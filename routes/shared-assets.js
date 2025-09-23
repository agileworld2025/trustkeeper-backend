const SharedAssetsController = require('../controllers/shared-assets');

module.exports = (router) => {
  router.get('/shared-assets/my-assets', SharedAssetsController.getSharedAssets);
  router.get('/shared-assets/summary', SharedAssetsController.getSharedAssetsSummary);
  router.post('/shared-assets/by-email', SharedAssetsController.getSharedAssetsByEmail);
  router.post('/shared-assets/check-app-status', SharedAssetsController.checkUserAppStatus);
  router.post('/shared-assets/send-download-notification', SharedAssetsController.sendAppDownloadNotification);
  router.post('/shared-assets/for-app', SharedAssetsController.getSharedAssetsForApp);
  router.get('/shared-assets/trustkeeper-interface', SharedAssetsController.getTrustKeeperSharingInterface);
};
