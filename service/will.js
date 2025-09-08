const { v1: uuidV1 } = require('uuid');
const { will_testament: WillTestamentModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await WillTestamentModel.create({
      public_id: publicId,
      ...convertedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Will testament successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveWillTestament',
          message: 'An error occurred while saving will testament data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const willTestamentDetails = await WillTestamentModel.findAll({
      where: { user_id: userId },
    });

    if (!willTestamentDetails.length) {
      return {
        errors: [
          {
            name: 'getWillTestament',
            message: 'No will testament details found',
          },
        ],
      };
    }

    return {
      doc: willTestamentDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getWillTestament',
          message: 'An error occurred while fetching will testament data',
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

    const [ updatedCount ] = await WillTestamentModel.update(updateData, {
      where: { public_id: publicId },
    });

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'patchWillTestament',
            message: 'No will testament details found',
          },
        ],
      };
    }

    return {
      doc: {
        publicId,
        message: 'Will testament successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'patchWillTestament',
          message: 'An error occurred while updating will testament data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, userId } = payload;

    const deletedCount = await WillTestamentModel.destroy({
      where: { public_id: publicId, user_id: userId },
    });

    if (!deletedCount) {
      return {
        errors: [
          {
            name: 'deleteWillTestament',
            message: 'No will testament details found',
          },
        ],
      };
    }

    return {
      doc: {
        message: 'Will testament successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteWillTestament',
          message: 'An error occurred while deleting will testament data',
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
