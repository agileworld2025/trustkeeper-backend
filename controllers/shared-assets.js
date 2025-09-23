/* eslint-disable no-console */
const DocumentSharingService = require('../service/document-sharing');
const SharedAssetsService = require('../service/shared-assets');
const FamilyMemberService = require('../service/family-member');
const { addFamilyMember: addFamilyMemberSchema } = require('../dto-schemas/document-sharing');

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

    const result = await SharedAssetsService.getSharedAssetsForUser(payload);

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

    const result = await SharedAssetsService.getSharedAssetsForUser(payload);

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

    const result = await SharedAssetsService.getSharedAssetsForUser(payload);

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

    const result = await SharedAssetsService.getSharedAssetsForUser(payload);

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

    const result = await SharedAssetsService.getSharedAssetsForUser(payload);

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

const addFamilyMember = async (req, res) => {
  try {
    const { userId } = req.auth;
    const payload = { ...req.body, userId };

    const isValid = addFamilyMemberSchema(payload);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors: addFamilyMemberSchema.errors,
      });
    }

    const result = await FamilyMemberService.addFamilyMember(payload);

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
    console.error('Add family member controller error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getSharedAssets,
  getSharedAssetsSummary,
  getSharedAssetsByEmail,
  checkUserAppStatus,
  sendAppDownloadNotification,
  getSharedAssetsForApp,
  getTrustKeeperSharingInterface,
  addFamilyMember,
};
