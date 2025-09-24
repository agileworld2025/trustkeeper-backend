const { v1: uuidV1 } = require('uuid');
const { email_account: EmailAccountModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await EmailAccountModel.create({
      public_id: publicId,
      ...convertedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Email account successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveEmailAccount',
          message: 'An error occurred while saving email account data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const emailAccountDetails = await EmailAccountModel.findAll({
      where: { user_id: userId, is_deleted: 0 },
    });

    if (!emailAccountDetails.length) {
      return {
        errors: [
          {
            name: 'getEmailAccount',
            message: 'No email account details found',
          },
        ],
      };
    }

    return {
      doc: emailAccountDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getEmailAccount',
          message: 'An error occurred while fetching email account data',
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

    const [ updatedCount ] = await EmailAccountModel.update(updateData, {
      where: { public_id: publicId, is_deleted: 0 },
    });

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'patchEmailAccount',
            message: 'No email account details found',
          },
        ],
      };
    }

    return {
      doc: {
        publicId,
        message: 'Email account successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'patchEmailAccount',
          message: 'An error occurred while updating email account data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, userId } = payload;

    const [ updatedCount ] = await EmailAccountModel.update(
      { is_deleted: 1, updated_by: userId },
      {
        where: { public_id: publicId, user_id: userId, is_deleted: 0 },
      },
    );

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'deleteEmailAccount',
            message: 'No email account details found',
          },
        ],
      };
    }

    return {
      doc: {
        message: 'Email account successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteEmailAccount',
          message: 'An error occurred while deleting email account data',
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
