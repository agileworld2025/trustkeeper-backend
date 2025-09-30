const { v1: uuidV1 } = require('uuid');
const { lic: LicModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const encryptionConfig = require('../config/encryption-fields');

const encryptionFields = encryptionConfig.lic || [];

const save = async (data) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(data);

    // Encrypt sensitive fields before saving to database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    await LicModel.create({
      public_id: publicId,
      ...encryptedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return { doc: { publicId, message: 'lic details successfully saved.' } };
  } catch (error) {
    return { errors: [ { name: 'save', message: 'An error occurred while saving lic data' } ] };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const response = await LicModel.findAll({
      where: { user_id: customerId || userId, is_deleted: false },
    });

    if (!response.length) {
      return { count: 0, doc: [] };
    }

    // Convert to plain objects and decrypt sensitive fields before returning to user
    const plainRecords = response.map((r) => r.get({ plain: true }));
    const decryptedDocs = decryptArray(plainRecords, encryptionFields);

    return { count: decryptedDocs.length, doc: decryptedDocs };
  } catch (error) {
    return { errors: [ { name: 'getAll', message: 'An error occurred while fetching lic data' } ] };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, updatedBy, ...newDoc } = payload;
    const convertedPayload = camelToSnake(newDoc);

    // Encrypt sensitive fields before updating in database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);
    const updateData = {
      ...encryptedPayload,
      updated_by: updatedBy,
    };

    const [ updatedCount ] = await LicModel.update(updateData, {
      where: { public_id: publicId, is_deleted: false },
    });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No lic record found' } ] };
    }

    return { doc: { message: 'lic details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating lic data' } ] };
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
      return { errors: [ { name: 'deleted', message: 'No lic record found' } ] };
    }

    return { doc: { message: 'lic details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting lic data' } ] };
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
