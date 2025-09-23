/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { v1: uuidV1 } = require('uuid');
const {
  document_sharing: DocumentSharingModel,
  user: UserModel,
  user_relation: UserRelationModel,
  will_testament: WillTestamentModel,
  business_ownership: BusinessOwnershipModel,
  real_estate_records: RealEstateModel,
  mutualFunds: MutualFundModel,
  stockMarketDetails: StocksModel,
  cryptocurrency_details: CryptoModel,
  fixed_deposits: FixedDepositModel,
  gold_details: GoldDetailsModel,
  insurances: InsuranceModel,
  lic: LicModel,
  medical_policy: MedicalPolicyModel,
  term_insurance: TermInsuranceModel,
  credit_card: CreditCardModel,
  loan_details: LoanDetailsModel,
  tax_details: TaxDetailsModel,
  vehicle: VehicleModel,
  power_attorney: PowerAttorneyModel,
  trust_details: TrustDetailsModel,
  legal_advisor: LegalAdvisorModel,
  Op,
} = require('../database');
const { camelToSnake, convertSnakeToCamel } = require('../utils/helper');
const {
  generateSharingToken,
  sendDocumentSharingEmail,
  sendSharingNotificationToOwner,
  sendAppDownloadEmail,
  sendAppNotificationEmail,
} = require('../utils/email-service');
const {
  checkUserAppStatus,
  sendAppDownloadNotification,
  shareDocumentWithTrustKeeper: shareDocumentWithTrustKeeperIntegration,
} = require('./trustkeeper-integration');
const { getSharedAssetsForUser } = require('./shared-assets-helper');

// Document type to model mapping
const DOCUMENT_MODELS = {
  will_testament: WillTestamentModel,
  business_ownership: BusinessOwnershipModel,
  real_estate: RealEstateModel,
  mutual_fund: MutualFundModel,
  stocks: StocksModel,
  crypto: CryptoModel,
  fixed_deposit: FixedDepositModel,
  gold_details: GoldDetailsModel,
  insurance: InsuranceModel,
  lic: LicModel,
  medical_policy: MedicalPolicyModel,
  term_insurance: TermInsuranceModel,
  credit_card: CreditCardModel,
  loan_details: LoanDetailsModel,
  tax_details: TaxDetailsModel,
  vehicle: VehicleModel,
  power_attorney: PowerAttorneyModel,
  trust_details: TrustDetailsModel,
  legal_advisor: LegalAdvisorModel,
};

// Share document with relative or email
const shareDocument = async (payload) => {
  try {
    const {
      userId,
      documentType,
      documentId,
      sharedWithEmail,
      relativeId,
      accessLevel = 'read_only',
      expiresAt,
      message,
    } = payload;

    // Verify document exists and belongs to user
    const DocumentModel = DOCUMENT_MODELS[documentType];

    if (!DocumentModel) {
      return {
        errors: [ {
          name: 'shareDocument',
          message: 'Invalid document type',
        } ],
      };
    }

    const document = await DocumentModel.findOne({
      where: {
        public_id: documentId,
        user_id: userId,
      },
    });

    if (!document) {
      return {
        errors: [ {
          name: 'shareDocument',
          message: 'Document not found or you do not have permission to share it',
        } ],
      };
    }

    // Get recipient information
    let recipientEmail; let recipientName; let
      relativeInfo;

    if (relativeId) {
      // Sharing with a relative
      relativeInfo = await UserRelationModel.findOne({
        where: {
          public_id: relativeId,
          user_id: userId,
        },
      });

      if (!relativeInfo) {
        return {
          errors: [ {
            name: 'shareDocument',
            message: 'Relative not found',
          } ],
        };
      }

      recipientEmail = relativeInfo.email;
      recipientName = relativeInfo.name;
    } else if (sharedWithEmail) {
      // Sharing with email
      recipientEmail = sharedWithEmail;
      recipientName = null;
    } else {
      return {
        errors: [ {
          name: 'shareDocument',
          message: 'Either relativeId or sharedWithEmail must be provided',
        } ],
      };
    }

    // Generate sharing token
    const sharingToken = generateSharingToken();
    const publicId = uuidV1();

    // Create sharing record
    const sharingData = {
      public_id: publicId,
      owner_user_id: userId,
      shared_with_user_id: null,
      shared_with_email: recipientEmail,
      relative_id: relativeId || null,
      document_type: documentType,
      document_id: documentId,
      sharing_token: sharingToken,
      access_level: accessLevel,
      is_active: true,
      expires_at: expiresAt ? new Date(expiresAt) : null,
      message: message || null,
      created_by: userId,
      updated_by: userId,
    };

    const convertedData = camelToSnake(sharingData);

    await DocumentSharingModel.create(convertedData);

    // Get owner information for email
    const owner = await UserModel.findOne({
      where: { public_id: userId },
      attributes: [ 'name', 'email' ],
    });

    // Generate sharing URL
    const baseUrl = process.env.BASE_URL || 'https://trustkeeperbe-cschabgpbjhdakev.eastus-01.azurewebsites.net';
    const sharingUrl = `${baseUrl}/api/document-sharing/view/${sharingToken}`;

    const documentDataForEmail = convertSnakeToCamel(document.dataValues);

    const emailResult = await sendDocumentSharingEmail({
      recipientEmail,
      recipientName: recipientName || recipientEmail.split('@')[0],
      ownerName: owner.name || 'Document Owner',
      documentType,
      documentName: document.business_name || document.executor || 'Document',
      sharingUrl,
      message,
      expiresAt,
      documentData: documentDataForEmail,
    });

    // Send confirmation email to owner
    await sendSharingNotificationToOwner({
      ownerEmail: owner.email,
      ownerName: owner.name || 'You',
      recipientEmail,
      recipientName: recipientName || recipientEmail.split('@')[0],
      documentType,
      documentName: document.business_name || document.executor || 'Document',
    });

    return {
      doc: {
        sharingId: publicId,
        sharingToken,
        sharingUrl,
        message: 'Document shared successfully',
        emailSent: emailResult.success,
      },
    };
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Share document error:', error);

    return {
      errors: [ {
        name: 'shareDocument',
        message: 'An error occurred while sharing the document',
      } ],
    };
  }
};

// Get shared documents for a user
const getSharedDocuments = async (payload) => {
  try {
    const {
      userId,
      documentType,
      page = 1,
      limit = 10,
      status = 'active',
    } = payload;

    const offset = (page - 1) * limit;
    const whereClause = { owner_user_id: userId };

    if (documentType) {
      whereClause.document_type = documentType;
    }

    if (status === 'active') {
      whereClause.is_active = true;
      whereClause[Op.or] = [
        { expires_at: null },
        { expires_at: { [Op.gt]: new Date() } },
      ];
    } else if (status === 'expired') {
      whereClause[Op.and] = [
        { expires_at: { [Op.ne]: null } },
        { expires_at: { [Op.lte]: new Date() } },
      ];
    } else if (status === 'revoked') {
      whereClause.is_active = false;
    }

    const { count, rows } = await DocumentSharingModel.findAndCountAll({
      where: whereClause,
      order: [ [ 'created_at', 'DESC' ] ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const documents = rows.map((row) => {
      const doc = convertSnakeToCamel(row.dataValues);

      return {
        ...doc,
        relative: null,
      };
    });

    return {
      doc: {
        documents,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    };
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Get shared documents error:', error);

    return {
      errors: [ {
        name: 'getSharedDocuments',
        message: 'An error occurred while fetching shared documents',
      } ],
    };
  }
};

// Get document by sharing token (for viewing)
const getDocumentByToken = async (payload) => {
  try {
    const { token } = payload;

    const sharing = await DocumentSharingModel.findOne({
      where: { sharing_token: token },
    });

    if (!sharing) {
      return {
        errors: [ {
          name: 'getDocumentByToken',
          message: 'Invalid or expired sharing link',
        } ],
      };
    }

    // Check if sharing is active
    if (!sharing.is_active) {
      return {
        errors: [ {
          name: 'getDocumentByToken',
          message: 'This sharing link has been revoked',
        } ],
      };
    }

    // Check if sharing has expired
    if (sharing.expires_at && new Date() > new Date(sharing.expires_at)) {
      return {
        errors: [ {
          name: 'getDocumentByToken',
          message: 'This sharing link has expired',
        } ],
      };
    }

    // Get the actual document
    const DocumentModel = DOCUMENT_MODELS[sharing.document_type];

    if (!DocumentModel) {
      return {
        errors: [ {
          name: 'getDocumentByToken',
          message: 'Document type not supported',
        } ],
      };
    }

    const document = await DocumentModel.findOne({
      where: { public_id: sharing.document_id },
    });

    if (!document) {
      return {
        errors: [ {
          name: 'getDocumentByToken',
          message: 'Document not found',
        } ],
      };
    }

    // Update access statistics
    await DocumentSharingModel.update(
      {
        last_accessed_at: new Date(),
        access_count: sharing.access_count + 1,
      },
      { where: { public_id: sharing.public_id } },
    );

    // Get owner information
    const owner = await UserModel.findOne({
      where: { public_id: sharing.owner_user_id },
      attributes: [ 'name', 'email' ],
    });

    // Get relative information if exists
    let relative = null;

    if (sharing.relative_id) {
      relative = await UserRelationModel.findOne({
        where: { public_id: sharing.relative_id },
        attributes: [ 'name', 'email', 'relation_type' ],
      });
    }

    const documentData = convertSnakeToCamel(document.dataValues);
    const sharingData = convertSnakeToCamel(sharing.dataValues);

    return {
      doc: {
        document: documentData,
        sharing: {
          owner: owner ? convertSnakeToCamel(owner.dataValues) : null,
          relative: relative ? convertSnakeToCamel(relative.dataValues) : null,
          accessLevel: sharingData.accessLevel,
          message: sharingData.message,
          sharedAt: sharingData.createdAt,
          lastAccessedAt: sharingData.lastAccessedAt,
          accessCount: sharingData.accessCount,
        },
      },
    };
  } catch (error) {
    /* eslint-disable no-console */
    console.error('Get document by token error:', error);

    return {
      errors: [ {
        name: 'getDocumentByToken',
        message: 'An error occurred while fetching the document',
      } ],
    };
  }
};

// Revoke document sharing
const revokeSharing = async (payload) => {
  try {
    const { userId, sharingId, token } = payload;

    let whereClause;

    if (sharingId) {
      whereClause = {
        public_id: sharingId,
        owner_user_id: userId,
      };
    } else if (token) {
      whereClause = {
        sharing_token: token,
        owner_user_id: userId,
      };
    } else {
      return {
        errors: [ {
          name: 'revokeSharing',
          message: 'Either sharingId or token must be provided',
        } ],
      };
    }

    const [ updatedCount ] = await DocumentSharingModel.update(
      {
        is_active: false,
        updated_by: userId,
      },
      { where: whereClause },
    );

    if (!updatedCount) {
      return {
        errors: [ {
          name: 'revokeSharing',
          message: 'Sharing record not found or already revoked',
        } ],
      };
    }

    return {
      doc: {
        message: 'Document sharing revoked successfully',
      },
    };
  } catch (error) {
    console.error('Revoke sharing error:', error);

    return {
      errors: [ {
        name: 'revokeSharing',
        message: 'An error occurred while revoking document sharing',
      } ],
    };
  }
};

// Shared assets functionality moved to shared-assets-helper.js

// Send enhanced shared assets notification
const sendEnhancedSharedAssetsNotification = async (payload) => {
  try {
    const {
      recipientEmail, ownerName,
    } = payload;

    // Check if user has the app
    const user = await UserModel.findOne({
      where: { email: recipientEmail },
      attributes: [ 'public_id', 'name', 'email' ],
    });

    if (user) {
      // User has the app, send shared assets email
      const sharedAssets = await getSharedAssetsForUser({
        userId: user.public_id,
        userEmail: user.email,
      });

      if (sharedAssets.doc.sharedAssets.length > 0) {
        await sendAppNotificationEmail({
          recipientEmail: user.email,
          recipientName: user.name,
          ownerName,
          appDeepLink: process.env.APP_DEEP_LINK || 'trustkeeper://shared-assets',
          appName: process.env.APP_NAME || 'TrustKeeper',
          message: 'You have received new shared assets. Open the app to view details.',
        });
      }
    } else {
      // User doesn't have the app, send download email
      await sendAppDownloadEmail({
        recipientEmail,
        ownerName,
        sharedAssetsCount: 1,
        appDownloadUrl: process.env.APP_DOWNLOAD_URL || 'https://play.google.com/store/apps/details?id=com.get.paisa',
        appName: process.env.APP_NAME || 'TrustKeeper',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Send enhanced shared assets notification error:', error);

    return { success: false, error: error.message };
  }
};

// Enhanced share document with TrustKeeper app integration
const shareDocumentWithTrustKeeper = async (payload) => shareDocumentWithTrustKeeperIntegration(payload, shareDocument);

module.exports = {
  shareDocument,
  getSharedDocuments,
  getDocumentByToken,
  revokeSharing,
  sendEnhancedSharedAssetsNotification,
  getSharedAssetsForUser,
  checkUserAppStatus,
  sendAppDownloadNotification,
  shareDocumentWithTrustKeeper,
};
