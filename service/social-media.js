const { v1: uuidV1 } = require('uuid');
const { social_media: SocialMediaModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const { social_media: encryptionFields } = require('../config/encryption-fields');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    // Encrypt sensitive fields before saving to database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    await SocialMediaModel.create({
      public_id: publicId,
      ...encryptedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Social media details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveSocialMedia',
          message: 'An error occurred while saving social media data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const socialMediaDetails = await SocialMediaModel.findAll({
      where: {
        user_id: customerId || userId,
        is_deleted: false,
      },
    });

    if (!socialMediaDetails.length) {
      return {
        errors: [
          {
            name: 'getSocialMedia',
            message: 'No social media details found',
          },
        ],
      };
    }

    // Convert to plain objects and decrypt sensitive fields before returning to user
    const plainRecords = socialMediaDetails.map((r) => r.get({ plain: true }));
    const decryptedDetails = decryptArray(plainRecords, encryptionFields);

    return {
      doc: decryptedDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getSocialMedia',
          message: 'An error occurred while fetching social media data',
        },
      ],
    };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, updatedBy, ...newDoc } = payload;
    const convertedPayload = camelToSnake(newDoc);

    // Encrypt sensitive fields before updating in database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);
    const updateData = {
      ...encryptedPayload,
      updated_by: updatedBy,
    };

    const [ updatedCount ] = await SocialMediaModel.update(updateData, {
      where: { public_id: publicId, is_deleted: false },
    });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No social media record found' } ] };
    }

    return { doc: { message: 'Social media details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating social media data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;

    const [ updatedCount ] = await SocialMediaModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No social media record found' } ] };
    }

    return { doc: { message: 'Social media details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting social media data' } ] };
  }
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
