const { v1: uuidV1 } = require('uuid');
const { cryptocurrency_details: CryptoDetailsModel } = require('../database');

const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const { userId, ...rest } = payload;

    const postData = camelToSnake(rest);
    const checkDuplicate = await CryptoDetailsModel.findOne({
      where: {
        private_keys: postData.private_keys,
      },
    });

    if (checkDuplicate) {
      return {
        errors: [
          {
            name: 'saveCryptoDetails',
            message: 'Private keys already exist, edit the existing record',
          },
        ],
      };
    }

    await CryptoDetailsModel.create({
      public_id: publicId,
      user_id: userId,
      created_by: userId,
      updated_by: userId,
      ...postData,
    });

    return {
      doc: {
        user_id: userId,
        publicId,
        message: 'Crypto details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveCryptoDetails',
          message: 'An error occurred while saving crypto data',
        },
      ],
    };
  }
};

const getAll = async (userId) => {
  try {
    const data = await CryptoDetailsModel.findAll({
      where: {
        user_id: userId,
        isDeleted: false,
      },
    });

    return {
      doc: data,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getAllCryptoDetails',
          message: 'An error occurred while retrieving crypto data',
        },
      ],
    };
  }
};

const patch = async (payload) => {
  try {
    const { userId, ...rest } = payload;

    const postData = camelToSnake(rest);

    await CryptoDetailsModel.update(
      {
        ...postData,
        updated_by: userId,
      },
      {
        where: {
          public_id: postData.public_id,
        },
      },
    );

    return {
      doc: {
        user_id: userId,
        publicId: postData.public_id,
        message: 'Crypto details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'patchCryptoDetails',
          message: 'An error occurred while updating crypto data',
        },
      ],
    };
  }
};
const deleted = async (payload) => {
  try {
    const { userId, publicId } = payload;
    const checkData = await CryptoDetailsModel.findOne({
      where: {
        public_id: publicId,
        isDeleted: false,
      },
    });

    if (!checkData) {
      return {
        errors: [
          {
            name: 'deleteCryptoDetails',
            message: 'Crypto details not found or already deleted',
          },
        ],
      };
    }

    await CryptoDetailsModel.update(
      {
        isDeleted: true,
        updated_by: userId,
      },
      {
        where: {
          public_id: publicId,
        },
      },
    );

    return {
      doc: {
        message: 'Crypto details successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteCryptoDetails',
          message: 'An error occurred while deleting crypto data',
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
