const { v1: uuidV1 } = require('uuid');
const { lic: LicModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const { lic: encryptionFields } = require('../config/encryption-fields');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);
    const encryptedData = JSON.stringify(encryptedPayload);
    const userId = convertedPayload.user_id || payload.userId;

    await LicModel.create({
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
        message: 'LIC details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveLic',
          message: 'An error occurred while saving LIC data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const licDetails = await LicModel.findAll({
      where: {
        user_id: customerId || userId,
        is_deleted: false,
      },
    });

    if (!licDetails.length) {
      return {
        errors: [
          {
            name: 'getLic',
            message: 'No LIC details found',
          },
        ],
      };
    }

    const plainRecords = licDetails.map((r) => {
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
          name: 'getLic',
          message: 'An error occurred while fetching LIC data',
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

    const [ updatedCount ] = await LicModel.update(updateData, {
      where: { public_id: publicId, is_deleted: false },
    });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No LIC record found' } ] };
    }

    return { doc: { message: 'LIC details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating LIC data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;

    const [ updatedCount ] = await LicModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No LIC record found' } ] };
    }

    return { doc: { message: 'LIC details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting LIC data' } ] };
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
