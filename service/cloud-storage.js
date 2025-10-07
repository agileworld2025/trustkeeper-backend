const { v1: uuidV1 } = require('uuid');
const { cloud_storage: CloudStorageModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const { cloud_storage: encryptionFields } = require('../config/encryption-fields');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    await CloudStorageModel.create({
      public_id: publicId,
      ...encryptedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return { doc: { publicId, message: 'Cloud storage details successfully saved.' } };
  } catch (error) {
    return { errors: [ { name: 'saveCloudStorage', message: 'An error occurred while saving cloud storage data' } ] };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const records = await CloudStorageModel.findAll({
      where: { user_id: customerId || userId, is_deleted: false },
    });

    if (!records.length) {
      return { errors: [ { name: 'getCloudStorage', message: 'No cloud storage details found' } ] };
    }

    const plainRecords = records.map((r) => r.get({ plain: true }));
    const decrypted = decryptArray(plainRecords, encryptionFields);

    return { doc: decrypted };
  } catch (error) {
    return { errors: [ { name: 'getCloudStorage', message: 'An error occurred while fetching cloud storage data' } ] };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, updatedBy, ...newDoc } = payload;
    const convertedPayload = camelToSnake(newDoc);
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    const updateData = { ...encryptedPayload, updated_by: updatedBy };

    const [ updatedCount ] = await CloudStorageModel.update(updateData, { where: { public_id: publicId, is_deleted: false } });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No cloud storage record found' } ] };
    }

    return { doc: { message: 'Cloud storage details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating cloud storage data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;
    const [ updatedCount ] = await CloudStorageModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No cloud storage record found' } ] };
    }

    return { doc: { message: 'Cloud storage details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting cloud storage data' } ] };
  }
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
