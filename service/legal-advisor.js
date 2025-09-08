const { v1: uuidV1 } = require('uuid');
const { legal_advisor: LegalAdvisorModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await LegalAdvisorModel.create({
      public_id: publicId,
      ...convertedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Will LegalAdvisor successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveLegalAdvisorDetails',
          message: 'An error occurred while saving LegalAdvisor data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const legalAdvisorDetails = await LegalAdvisorModel.findAll({
      where: { user_id: userId },
    });

    if (!legalAdvisorDetails.length) {
      return {
        errors: [
          {
            name: 'saveLegalAdvisorDetails',
            message: 'No trust details details found',
          },
        ],
      };
    }

    return {
      doc: legalAdvisorDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'legalAdvisor',
          message: 'An error occurred while fetching will legalAdvisor data',
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

    const existingDetails = await LegalAdvisorModel.findOne({
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

    const [ updatedCount ] = await LegalAdvisorModel.update(
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

    const existingDetail = await LegalAdvisorModel.findOne({
      where: { public_id: publicId, user_id: userId, is_deleted: false },
    });

    if (!existingDetail) {
      return {
        errors: [
          {
            name: 'deleteLegalAdvisorDetails',
            message: 'No Legal Advisor details found',
          },
        ],
      };
    }

    const [ deletedCount ] = await LegalAdvisorModel.update(
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
          name: 'deleteLegalAdvisorDetails',
          message: 'An error occurred while deleting Legal Advisor data',
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
