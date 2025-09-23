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

module.exports = {
  shareDocument,
  shareDocumentWithTrustKeeper,
  getSharedDocuments,
  getDocumentByToken,
  revokeSharing,
  getSharingStats,
};
