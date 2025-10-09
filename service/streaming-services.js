const { v1: uuidV1 } = require('uuid');
const { streaming_services: StreamingServicesModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const { 'streaming-services': encryptionFields } = require('../config/encryption-fields');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    await StreamingServicesModel.create({
      public_id: publicId,
      ...encryptedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return { doc: { publicId, message: 'Streaming services details successfully saved.' } };
  } catch (error) {
    return { errors: [ { name: 'saveStreamingServices', message: 'An error occurred while saving streaming services data' } ] };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const records = await StreamingServicesModel.findAll({
      where: { user_id: customerId || userId, is_deleted: false },
    });

    if (!records.length) {
      return { errors: [ { name: 'getStreamingServices', message: 'No streaming services details found' } ] };
    }

    const plainRecords = records.map((r) => r.get({ plain: true }));
    const decrypted = decryptArray(plainRecords, encryptionFields);

    return { doc: decrypted };
  } catch (error) {
    return { errors: [ { name: 'getStreamingServices', message: 'An error occurred while fetching streaming services data' } ] };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, updatedBy, ...newDoc } = payload;
    const convertedPayload = camelToSnake(newDoc);
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    const updateData = { ...encryptedPayload, updated_by: updatedBy };

    const [ updatedCount ] = await StreamingServicesModel.update(updateData, { where: { public_id: publicId, is_deleted: false } });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No streaming services record found' } ] };
    }

    return { doc: { message: 'Streaming services details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating streaming services data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;
    const [ updatedCount ] = await StreamingServicesModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No streaming services record found' } ] };
    }

    return { doc: { message: 'Streaming services details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting streaming services data' } ] };
  }
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
