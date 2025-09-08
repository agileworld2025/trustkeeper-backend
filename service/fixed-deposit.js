const { v1: uuidV1 } = require('uuid');
const { fixed_deposits: FixedDepositModel } = require('../database');

const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const { userId, ...rest } = payload;

    const postData = camelToSnake(rest);
    const checkDuplicate = await FixedDepositModel.findOne({
      where: {
        fd_number: postData.fd_number,
      },
    });

    if (checkDuplicate) {
      return {
        errors: [
          {
            name: 'saveFixedDepositDetails',
            message: 'FD number already exists, edit the existing record',
          },
        ],
      };
    }

    await FixedDepositModel.create({
      public_id: publicId,
      user_id: userId,
      ...postData,
    });

    return {
      doc: {
        user_id: userId,
        publicId,
        message: 'Fixed deposit details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveFixedDepositDetails',
          message: 'An error occurred while saving fixed deposit data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;
    const data = await FixedDepositModel.findAll({
      where: {
        user_id: userId,
        is_deleted: false,
      },

    });

    return {
      doc: data,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getFixedDepositDetails',
          message: 'An error occurred while fetching fixed deposit data',
        },
      ],
    };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, ...rest } = payload;

    const postData = camelToSnake(rest);

    await FixedDepositModel.update(postData, {
      where: {
        public_id: publicId,
      },
    });

    return {
      doc: {
        publicId,
        message: 'Fixed deposit details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'updateFixedDepositDetails',
          message: 'An error occurred while updating fixed deposit data',
        },
      ],
    };
  }
};
const deleted = async (payload) => {
  try {
    const { publicId } = payload;

    await FixedDepositModel.update({
      is_deleted: true,
    }, {
      where: {
        public_id: publicId,
      },
    });

    return {
      doc: {
        publicId,
        message: 'Fixed deposit details successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteFixedDepositDetails',
          message: 'An error occurred while deleting fixed deposit data',
        },
      ],
    };
  }
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
