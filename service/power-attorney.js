const { v1: uuidV1 } = require('uuid');
const { power_attorney: PowerAttorneyModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await PowerAttorneyModel.create({
      public_id: publicId,
      ...convertedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Power attorney successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'savePowerAttorney',
          message: 'An error occurred while saving power attorney data',
        },
      ],
    };
  }
};
const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const powerAttorneyDetails = await PowerAttorneyModel.findAll({
      where: {
        user_id: userId,
        is_deleted: false,
      },
    });

    if (!powerAttorneyDetails.length) {
      return {
        errors: [
          {
            name: 'getPowerAttorney',
            message: 'No power attorney details found',
          },
        ],
      };
    }

    return {
      doc: powerAttorneyDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getPowerAttorney',
          message: 'An error occurred while fetching power attorney data',
        },
      ],
    };
  }
};
const update = async (payload) => {
  try {
    const { publicId, userId, ...body } = payload;

    const convertedPayload = camelToSnake(body);
    const existingRecord = await PowerAttorneyModel.findOne({
      where: {
        public_id: publicId,
        is_deleted: false,
      },
    });

    if (!existingRecord) {
      return {
        errors: [
          {
            name: 'updatePowerAttorney',
            message: 'No record found.',
          },
        ],
      };
    }
    const [ updatedCount ] = await PowerAttorneyModel.update(
      {
        ...convertedPayload,
        updated_by: userId,
      },
      {
        where: {
          public_id: publicId,
        },
      },
    );

    if (updatedCount) {
      return {
        doc: {
          publicId,
          message: 'Power attorney successfully updated.',
        },
      };
    }
  } catch (error) {
    return {
      errors: [
        {
          name: 'patchPowerAttorney',
          message: 'An error occurred while updating power attorney data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId } = payload;
    const isExistingRecord = await PowerAttorneyModel.findOne({
      where: {
        public_id: publicId,
        is_deleted: false,
      },
    });

    if (!isExistingRecord) {
      return {
        errors: [
          {
            name: 'removePowerAttorney',
            message: 'Power attorney record not found or already deleted.',
          },
        ],
      };
    }

    await PowerAttorneyModel.update(
      {
        is_deleted: true,
      },
      {
        where: { public_id: publicId },
      },
    );

    return {
      doc: {
        message: 'Power attorney successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'removePowerAttorney',
          message: 'An error occurred while deleting power attorney data',
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
