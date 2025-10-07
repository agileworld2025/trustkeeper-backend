const { v1: uuidV1 } = require('uuid');
const { bank: BankModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const { bank: encryptionFields } = require('../config/encryption-fields');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);
    const encryptedData = JSON.stringify(encryptedPayload);
    const userId = convertedPayload.user_id || payload.userId;

    await BankModel.create({
      public_id: publicId,
      encrypted_id: encryptedData,
      ...encryptedPayload,
      user_id: userId,
      updated_by: userId,
      created_by: userId,
    });

    return {
      doc: {
        publicId,
        message: 'Bank details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveBank',
          message: 'An error occurred while saving bank data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const bankDetails = await BankModel.findAll({
      where: {
        user_id: customerId || userId,
        is_deleted: false,
      },
    });

    if (!bankDetails.length) {
      return {
        errors: [
          {
            name: 'getBank',
            message: 'No bank details found',
          },
        ],
      };
    }

    const plainRecords = bankDetails.map((r) => {
      const record = r.get({ plain: true });

      if (record.encrypted_id) {
        const decryptedData = JSON.parse(record.encrypted_id);

        return { ...record, ...decryptedData };
      }

      return record;
    });
    const decryptedDetails = decryptArray(plainRecords, encryptionFields);

    return {
      doc: decryptedDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getBank',
          message: 'An error occurred while fetching bank data',
        },
      ],
    };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, updatedBy, ...newDoc } = payload;
    const convertedPayload = camelToSnake(newDoc);

    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    const encryptedData = JSON.stringify(encryptedPayload);

    const updateData = {
      encrypted_id: encryptedData,
      ...encryptedPayload,
      updated_by: updatedBy,
    };

    const [ updatedCount ] = await BankModel.update(updateData, {
      where: { public_id: publicId, is_deleted: false },
    });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No bank record found' } ] };
    }

    return { doc: { message: 'Bank details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating bank data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;

    const [ updatedCount ] = await BankModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No bank record found' } ] };
    }

    return { doc: { message: 'Bank details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting bank data' } ] };
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
