const { v1: uuidV1 } = require('uuid');
const { trust_details: TrustDetailsModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await TrustDetailsModel.create({
      public_id: publicId,
      ...convertedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Will trust successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveTrustDetails',
          message: 'An error occurred while saving trust data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const trustDetails = await TrustDetailsModel.findAll({
      where: { user_id: userId },
    });

    if (!trustDetails.length) {
      return {
        errors: [
          {
            name: 'saveTrustDetails',
            message: 'No trust details details found',
          },
        ],
      };
    }

    return {
      doc: trustDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'trust',
          message: 'An error occurred while fetching will trust data',
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

    const existingDetails = await TrustDetailsModel.findOne({
      where: {
        public_id: publicId,
      },
    });

    if (!existingDetails) {
      return {
        errors: [
          {
            name: 'Not Found',
            message: 'Data Not Found',
          },
        ],
      };
    }

    const convertedPayload = camelToSnake(rest);

    const [ updatedCount ] = await TrustDetailsModel.update(
      {
        ...convertedPayload,
        updated_by: userId,

      },
      {
        where: { public_id: publicId },
      },
    );

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'patchTrustDetails',
            message: 'No will trust details found',
          },
        ],
      };
    }

    return {
      doc: {
        publicId,
        message: 'trust details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'trustDetails',
          message: 'An error occurred while updating will trust data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, userId } = payload;

    const existingDetail = await TrustDetailsModel.findOne({
      where: { public_id: publicId, user_id: userId, is_deleted: false },
    });

    if (!existingDetail) {
      return {
        errors: [
          {
            name: 'deleteTrustDetails',
            message: 'No trust details found',
          },
        ],
      };
    }

    const [ deletedCount ] = await TrustDetailsModel.update(
      { is_deleted: true },
      {
        where: { public_id: publicId, user_id: userId },
      },
    );

    if (!deletedCount) {
      return {
        errors: {
          message: 'Something Went Wrong.',
          publicId,
        },
      };
    }

    return {
      doc: {
        publicId,
        message: 'Successfully Deleted',
      },

    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteTrustDetails',
          message: 'An error occurred while deleting trust data',
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
