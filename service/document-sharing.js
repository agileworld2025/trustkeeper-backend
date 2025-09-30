const { v1: uuidV1 } = require('uuid');
const { 'document-sharing': DocumentSharingModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const encryptionConfig = require('../config/encryption-fields');

const encryptionFields = encryptionConfig['document-sharing'] || [];

const save = async (data) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(data);

    // Encrypt sensitive fields before saving to database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    await DocumentSharingModel.create({
      public_id: publicId,
      ...encryptedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return { doc: { publicId, message: 'document sharing details successfully saved.' } };
  } catch (error) {
    return { errors: [ { name: 'save', message: 'An error occurred while saving document sharing data' } ] };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const response = await DocumentSharingModel.findAll({
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
    return { errors: [ { name: 'getAll', message: 'An error occurred while fetching document sharing data' } ] };
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

    const [ updatedCount ] = await DocumentSharingModel.update(updateData, {
      where: { public_id: publicId, is_deleted: false },
    });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No document sharing record found' } ] };
    }

    return { doc: { message: 'document sharing details successfully updated.', publicId } };
  } catch (error) {
    return { errors: [ { name: 'patch', message: 'An error occurred while updating document sharing data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;

    const [ updatedCount ] = await DocumentSharingModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No document sharing record found' } ] };
    }

    return { doc: { message: 'document sharing details successfully deleted.' } };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting document sharing data' } ] };
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
