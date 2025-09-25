const { v1: uuidV1 } = require('uuid');
const { social_media: SocialMediaModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await SocialMediaModel.create({
      public_id: publicId,
      ...convertedPayload,
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
    const { userId } = payload;

    const socialMediaDetails = await SocialMediaModel.findAll({
      where: { 
        user_id: userId,
        is_deleted: false
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

    return {
      doc: socialMediaDetails,
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

const update = async (payload) => {
  try {
    const {
      publicId,
      userId,
      ...rest
    } = payload;
    const convertedPayload = camelToSnake(rest);
    const updateData = {
      ...convertedPayload,
      updated_by: userId,
    };

    const [ updatedCount ] = await SocialMediaModel.update(updateData, {
      where: { 
        public_id: publicId,
        is_deleted: false
      },
    });

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'patchSocialMedia',
            message: 'No social media details found',
          },
        ],
      };
    }

    return {
      doc: {
        publicId,
        message: 'Social media details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'patchSocialMedia',
          message: 'An error occurred while updating social media data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, userId } = payload;

    const [ updatedCount ] = await SocialMediaModel.update(
      { 
        is_deleted: true,
        updated_by: userId
      },
      {
        where: { 
          public_id: publicId, 
          user_id: userId,
          is_deleted: false
        },
      }
    );

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'deleteSocialMedia',
            message: 'No social media details found',
          },
        ],
      };
    }

    return {
      doc: {
        message: 'Social media details successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteSocialMedia',
          message: 'An error occurred while deleting social media data',
        },
      ],
    };
  }
};

module.exports = {
  save,
  getAll,
  update,
  deleted,
};
