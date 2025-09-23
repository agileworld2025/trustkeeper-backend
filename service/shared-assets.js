/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
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
const { convertSnakeToCamel } = require('../utils/helper');

// Generate avatar initials (helper function)
const generateAvatar = (name) => {
  if (!name) return 'U';
  const names = name.split(' ');

  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }

  return name[0].toUpperCase();
};

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

// Get shared assets for user (helper function)
const getSharedAssetsForUser = async (payload) => {
  try {
    const { userId, userEmail } = payload;

    // Validate input parameters
    if (!userId && !userEmail) {
      return {
        doc: {
          sharedAssets: [],
          totalCount: 0,
          message: 'No user ID or email provided',
        },
      };
    }

    // Build WHERE clause conditionally
    const whereConditions = {
      is_active: true,
    };

    // Add user conditions only if they exist
    const orConditions = [];

    if (userId) {
      orConditions.push({ shared_with_user_id: userId });
    }
    if (userEmail) {
      orConditions.push({ shared_with_email: userEmail });
    }

    if (orConditions.length > 0) {
      whereConditions[Op.or] = orConditions;
    }

    // Find all documents shared with this user
    const sharedDocuments = await DocumentSharingModel.findAll({
      where: whereConditions,
      order: [ [ 'created_at', 'DESC' ] ],
    });

    if (!sharedDocuments || sharedDocuments.length === 0) {
      return {
        doc: {
          sharedAssets: [],
          totalCount: 0,
          message: 'No shared assets found',
        },
      };
    }

    // Get owner information for each shared document
    const sharedAssets = [];

    for (const sharing of sharedDocuments) {
      try {
        // Get owner information
        const owner = await UserModel.findOne({
          where: { public_id: sharing.owner_user_id },
          attributes: [ 'name', 'email', 'phone' ],
        });

        // Get relative information if exists
        let relative = null;

        if (sharing.relative_id) {
          relative = await UserRelationModel.findOne({
            where: { public_id: sharing.relative_id },
            // eslint-disable-next-line max-len
            attributes: [ 'name', 'email', 'mobile_number', 'alternate_phone', 'country_code', 'alternate_country_code', 'address_line_1', 'relation_type', 'access_level', 'is_active' ],
          });
        }

        // Get document data
        const DocumentModel = DOCUMENT_MODELS[sharing.document_type];

        if (DocumentModel) {
          const document = await DocumentModel.findOne({
            where: { public_id: sharing.document_id },
          });

          if (document) {
            const documentData = convertSnakeToCamel(document.dataValues);
            const sharingData = convertSnakeToCamel(sharing.dataValues);

            sharedAssets.push({
              sharingId: sharingData.publicId,
              sharingToken: sharingData.sharingToken,
              documentType: sharingData.documentType,
              documentId: sharingData.documentId,
              documentData,
              owner: owner ? convertSnakeToCamel(owner.dataValues) : null,
              relative: relative ? convertSnakeToCamel(relative.dataValues) : null,
              accessLevel: sharingData.accessLevel,
              message: sharingData.message,
              sharedAt: sharingData.createdAt,
              lastAccessedAt: sharingData.lastAccessedAt,
              accessCount: sharingData.accessCount,
              expiresAt: sharingData.expiresAt,
              isExpired: sharingData.expiresAt ? new Date() > new Date(sharingData.expiresAt) : false,
            });
          }
        }
      } catch (error) {
        console.error(`Error processing shared document ${sharing.public_id}:`, error);
        // Continue with other documents even if one fails
      }
    }

    // Format data to match TrustKeeper app UI
    const yourProfileSharedWith = [];
    const otherProfilesShared = [];

    // Group shared assets by owner/recipient
    const profileMap = new Map();

    sharedAssets.forEach((asset) => {
      const ownerId = (asset.owner && asset.owner.publicId) || 'unknown';
      const ownerName = (asset.owner && asset.owner.name) || 'Unknown';
      const ownerEmail = (asset.owner && asset.owner.email) || '';
      const ownerPhone = (asset.owner && asset.owner.phone) || '';
      const relationType = (asset.relative && asset.relative.relationType) || 'Family Member';
      const accessLevel = (asset.relative && asset.relative.accessLevel) || asset.accessLevel || 'view_only';

      // Get additional contact details from relative
      const alternatePhone = (asset.relative && asset.relative.alternatePhone) || '';
      const countryCode = (asset.relative && asset.relative.countryCode) || '+1';
      const alternateCountryCode = (asset.relative && asset.relative.alternateCountryCode) || '+1';
      const address = (asset.relative && asset.relative.addressLine1) || '';

      if (!profileMap.has(ownerId)) {
        profileMap.set(ownerId, {
          id: ownerId,
          name: ownerName,
          email: ownerEmail,
          phone: ownerPhone,
          alternatePhone,
          countryCode,
          alternateCountryCode,
          address,
          relationType,
          accessLevel,
          avatar: generateAvatar(ownerName),
          location: 'City, Country',
          sharedAssets: [],
          lastShared: asset.sharedAt,
        });
      }

      profileMap.get(ownerId).sharedAssets.push(asset);
    });

    // Convert to arrays and format for UI
    profileMap.forEach((profile) => {
      const formattedProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        alternatePhone: profile.alternatePhone,
        countryCode: profile.countryCode,
        alternateCountryCode: profile.alternateCountryCode,
        address: profile.address,
        avatar: profile.avatar,
        relationType: profile.relationType,
        accessLevel: profile.accessLevel,
        location: profile.location,
        lastShared: profile.lastShared,
        sharedAssetsCount: profile.sharedAssets.length,
      };

      // For now, add to both sections (you can modify logic based on your requirements)
      yourProfileSharedWith.push(formattedProfile);
      otherProfilesShared.push(formattedProfile);
    });

    return {
      doc: {
        yourProfileSharedWith,
        otherProfilesShared,
        totalCount: sharedAssets.length,
        message: `Found ${sharedAssets.length} shared assets`,
      },
    };
  } catch (error) {
    console.error('Get shared assets for user error:', error);

    return {
      doc: {
        sharedAssets: [],
        totalCount: 0,
        message: 'Error fetching shared assets',
      },
    };
  }
};

module.exports = {
  getSharedAssetsForUser,
};
