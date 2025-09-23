/* eslint-disable no-console */
const DocumentSharingService = require('../service/document-sharing');
const { shareDocument: shareDocumentSchema } = require('../dto-schemas/document-sharing');
// const { convertSnakeToCamel } = require('../utils/helper');

const shareDocument = async (req, res) => {
  try {
    const { userId } = req.auth;
    const payload = { ...req.body, userId };

    const isValid = shareDocumentSchema(payload);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors: shareDocumentSchema.errors,
      });
    }

    const result = await DocumentSharingService.shareDocument(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Share document controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get shared documents for a user
const getSharedDocuments = async (req, res) => {
  try {
    const { userId } = req.auth;
    const {
      documentType, page, limit, status,
    } = req.query;
    const payload = {
      userId,
      documentType,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status: status || 'active',
    };

    const result = await DocumentSharingService.getSharedDocuments(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Get shared documents controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get document by sharing token (public endpoint for viewing)
const getDocumentByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const payload = { token };

    const result = await DocumentSharingService.getDocumentByToken(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Get document by token controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Revoke document sharing
const revokeSharing = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { sharingId, token } = req.body;
    const payload = { userId, sharingId, token };

    const result = await DocumentSharingService.revokeSharing(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Revoke sharing controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get sharing statistics for a user
const getSharingStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { documentType } = req.query;

    const payload = {
      userId,
      documentType,
      page: 1,
      limit: 1000,
    };

    const result = await DocumentSharingService.getSharedDocuments(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    const { documents } = result.doc;
    const stats = {
      totalShared: documents.length,
      activeShares: documents.filter((doc) => doc.isActive && (!doc.expiresAt || new Date(doc.expiresAt) > new Date())).length,
      expiredShares: documents.filter((doc) => doc.expiresAt && new Date(doc.expiresAt) <= new Date()).length,
      revokedShares: documents.filter((doc) => !doc.isActive).length,
      totalAccessCount: documents.reduce((sum, doc) => sum + (doc.accessCount || 0), 0),
      documentTypeStats: {},
    };

    // Group by document type
    documents.forEach((doc) => {
      if (!stats.documentTypeStats[doc.documentType]) {
        stats.documentTypeStats[doc.documentType] = {
          count: 0,
          activeCount: 0,
          totalAccessCount: 0,
        };
      }
      stats.documentTypeStats[doc.documentType].count += 1;
      if (doc.isActive && (!doc.expiresAt || new Date(doc.expiresAt) > new Date())) {
        stats.documentTypeStats[doc.documentType].activeCount += 1;
      }
      stats.documentTypeStats[doc.documentType].totalAccessCount += (doc.accessCount || 0);
    });

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get sharing stats controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Share document with TrustKeeper app integration
const shareDocumentWithTrustKeeper = async (req, res) => {
  try {
    const { userId } = req.auth;
    const payload = { ...req.body, userId };

    const isValid = shareDocumentSchema(payload);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors: shareDocumentSchema.errors,
      });
    }

    const result = await DocumentSharingService.shareDocumentWithTrustKeeper(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Share document with TrustKeeper controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Check user app status
const checkUserAppStatus = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const result = await DocumentSharingService.checkUserAppStatus({ email });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Check user app status controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Send app download notification
const sendAppDownloadNotification = async (req, res) => {
  try {
    const { email, ownerName, sharedAssetsCount } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const result = await DocumentSharingService.sendAppDownloadNotification({
      email,
      ownerName: ownerName || 'Document Owner',
      sharedAssetsCount: sharedAssetsCount || 1,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Send app download notification controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get shared assets for a user
const getSharedAssets = async (req, res) => {
  try {
    const { userId } = req.auth;
    const {
      page, limit, documentType, status,
    } = req.query;

    const payload = {
      userId,
      userEmail: null,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      documentType,
      status: status || 'active',
    };

    const result = await DocumentSharingService.getSharedAssetsForUser(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Get shared assets controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getSharedAssetsSummary = async (req, res) => {
  try {
    const { userId } = req.auth;

    const payload = {
      userId,
      userEmail: null,
      page: 1,
      limit: 1000,
    };

    const result = await DocumentSharingService.getSharedAssetsForUser(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    const { sharedAssets } = result.doc;
    const summary = {
      totalAssets: sharedAssets.length,
      activeAssets: sharedAssets.filter((asset) => asset.isActive && !asset.isExpired).length,
      expiredAssets: sharedAssets.filter((asset) => asset.isExpired).length,
      documentTypeBreakdown: {},
      recentShares: sharedAssets
        .sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt))
        .slice(0, 5),
    };

    sharedAssets.forEach((asset) => {
      if (!summary.documentTypeBreakdown[asset.documentType]) {
        summary.documentTypeBreakdown[asset.documentType] = 0;
      }
      summary.documentTypeBreakdown[asset.documentType] += 1;
    });

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get shared assets summary controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getSharedAssetsByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const payload = {
      userId: null,
      userEmail: email,
      page: 1,
      limit: 1000,
    };

    const result = await DocumentSharingService.getSharedAssetsForUser(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Get shared assets by email controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getSharedAssetsForApp = async (req, res) => {
  try {
    const {
      userId, userEmail, page, limit, documentType, status,
    } = req.body;

    const payload = {
      userId: userId || null,
      userEmail: userEmail || null,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      documentType,
      status: status || 'active',
    };

    const result = await DocumentSharingService.getSharedAssetsForUser(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.doc,
    });
  } catch (error) {
    console.error('Get shared assets for app controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getTrustKeeperSharingInterface = async (req, res) => {
  try {
    const { userId } = req.auth;
    const payload = { userId };

    const result = await DocumentSharingService.getSharedAssetsForUser(payload);

    if (result.errors) {
      return res.status(400).json({
        success: false,
        errors: result.errors,
      });
    }

    const response = {
      success: true,
      data: {
        yourProfileSharedWith: {
          title: 'Your Profile Shared With',
          subtitle: 'People with whom your profile is shared is listed here.',
          profiles: result.doc.yourProfileSharedWith || [],
          addButton: {
            text: 'Add Family Members',
            icon: 'person-add',
          },
        },
        otherProfilesShared: {
          title: 'Other Profiles Shared',
          subtitle: 'Profiles that are shared with you are listed here.',
          profiles: result.doc.otherProfilesShared || [],
        },
        summary: {
          totalShared: result.doc.totalCount || 0,
          yourShares: result.doc.yourProfileSharedWith.length || 0, // eslint-disable-line no-nested-ternary
          sharedWithYou: result.doc.otherProfilesShared.length || 0, // eslint-disable-line no-nested-ternary
        },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get TrustKeeper sharing interface controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  shareDocument,
  shareDocumentWithTrustKeeper,
  getSharedDocuments,
  getDocumentByToken,
  revokeSharing,
  getSharingStats,
  checkUserAppStatus,
  sendAppDownloadNotification,
  getSharedAssets,
  getSharedAssetsSummary,
  getSharedAssetsByEmail,
  getSharedAssetsForApp,
  getTrustKeeperSharingInterface,
};
