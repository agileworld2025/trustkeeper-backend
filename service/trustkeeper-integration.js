/* eslint-disable no-console */
const { user: UserModel } = require('../database');
const { convertSnakeToCamel } = require('../utils/helper');
const {
  sendAppDownloadEmail,
  sendAppNotificationEmail,
} = require('../utils/email-service');

// Check if user has the app
const checkUserAppStatus = async (payload) => {
  try {
    const { email } = payload;

    if (!email) {
      return {
        errors: [ {
          name: 'checkUserAppStatus',
          message: 'Email is required',
        } ],
      };
    }

    const user = await UserModel.findOne({
      where: { email },
      attributes: [ 'public_id', 'name', 'email', 'created_at' ],
    });

    return {
      doc: {
        hasApp: !!user,
        user: user ? convertSnakeToCamel(user.dataValues) : null,
        message: user ? 'User has the app' : 'User does not have the app',
      },
    };
  } catch (error) {
    console.error('Check user app status error:', error);

    return {
      errors: [ {
        name: 'checkUserAppStatus',
        message: 'An error occurred while checking user app status',
      } ],
    };
  }
};

// Send app download notification
const sendAppDownloadNotification = async (payload) => {
  try {
    const {
      email,
      ownerName,
      sharedAssetsCount,
    } = payload;

    const result = await sendAppDownloadEmail({
      recipientEmail: email,
      ownerName: ownerName || 'Document Owner',
      sharedAssetsCount: sharedAssetsCount || 1,
      appDownloadUrl: process.env.APP_DOWNLOAD_URL || 'https://play.google.com/store/apps/details?id=com.get.paisa',
      appName: process.env.APP_NAME || 'TrustKeeper',
    });

    return {
      doc: {
        success: result.success,
        message: result.success ? 'App download notification sent successfully' : 'Failed to send notification',
        messageId: result.messageId,
      },
    };
  } catch (error) {
    console.error('Send app download notification error:', error);

    return {
      errors: [ {
        name: 'sendAppDownloadNotification',
        message: 'An error occurred while sending app download notification',
      } ],
    };
  }
};

// Enhanced share document with TrustKeeper app integration
const shareDocumentWithTrustKeeper = async (payload, shareDocument) => {
  try {
    const { sharedWithEmail, relativeId } = payload;

    // First, share the document normally
    const shareResult = await shareDocument(payload);

    if (shareResult.errors) {
      return shareResult;
    }

    // Check if recipient has the app
    const appStatusResult = await checkUserAppStatus({
      // We'll get email from relative if needed
      email: sharedWithEmail || (relativeId ? null : null),
    });

    if (appStatusResult.doc && appStatusResult.doc.hasApp) {
      // User has the app, send simple notification with app link only
      await sendAppNotificationEmail({
        recipientEmail: appStatusResult.doc.user.email,
        recipientName: appStatusResult.doc.user.name,
        ownerName: 'Document Owner',
        appDeepLink: process.env.APP_DEEP_LINK || 'trustkeeper://shared-assets',
        appName: process.env.APP_NAME || 'TrustKeeper',
        message: 'You have received new shared assets. Open the app to view details.',
      });
    } else {
      // User doesn't have the app, send download email with app link only
      await sendAppDownloadEmail({
        recipientEmail: sharedWithEmail || 'recipient@example.com',
        ownerName: 'Document Owner',
        sharedAssetsCount: 1,
        appDownloadUrl: process.env.APP_DOWNLOAD_URL || 'https://play.google.com/store/apps/details?id=com.get.paisa',
        appName: process.env.APP_NAME || 'TrustKeeper',
      });
    }

    return {
      doc: {
        ...shareResult.doc,
        trustKeeperIntegration: {
          appStatusChecked: true,
          hasApp: appStatusResult.doc ? appStatusResult.doc.hasApp : false,
          notificationSent: true,
        },
      },
    };
  } catch (error) {
    console.error('Share document with TrustKeeper error:', error);

    return {
      errors: [ {
        name: 'shareDocumentWithTrustKeeper',
        message: 'An error occurred while sharing document with TrustKeeper integration',
      } ],
    };
  }
};

module.exports = {
  checkUserAppStatus,
  sendAppDownloadNotification,
  shareDocumentWithTrustKeeper,
};
