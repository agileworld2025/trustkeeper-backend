const { v1: uuidV1 } = require('uuid');
const { credit_card: CreditCardModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decrypt } = require('../utils/encryption');
const encryptionConfig = require('../config/encryption-fields');

const encryptionFields = encryptionConfig['credit-card'] || [];

const save = async (data) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(data);

    // Encrypt sensitive fields before saving to database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    // Store the entire encrypted payload as a single blob
    const encryptedData = JSON.stringify(encryptedPayload);

    await CreditCardModel.create({
      public_id: publicId,
      encrypted_id: encryptedData,
      user_id: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
    });

    return { doc: { publicId, message: 'Credit card details successfully saved.' } };
  } catch (error) {
    // Log error for debugging
    // console.error('Credit card save error:', error);

    return { errors: [ { name: 'save', message: 'An error occurred while saving credit card data' } ] };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const response = await CreditCardModel.findAll({
      where: { user_id: customerId || userId, is_deleted: false },
    });

    if (!response.length) {
      return { count: 0, doc: [] };
    }

    // Decrypt the stored data
    const decryptedDocs = response.map((record) => {
      try {
        const encryptedData = JSON.parse(record.encrypted_id);
        const decryptedData = {};

        // Decrypt each field individually
        Object.keys(encryptedData).forEach((key) => {
          if (encryptionFields.includes(key)) {
            // This field was encrypted, so decrypt it
            decryptedData[key] = decrypt(encryptedData[key]);
          } else {
            // This field was not encrypted
            decryptedData[key] = encryptedData[key];
          }
        });

        return {
          public_id: record.public_id,
          user_id: record.user_id,
          created_by: record.created_by,
          updated_by: record.updated_by,
          is_deleted: record.is_deleted,
          created_at: record.created_at,
          updated_at: record.updated_at,
          ...decryptedData,
        };
      } catch (error) {
        // console.error('Error decrypting credit card data:', error);

        return {
          public_id: record.public_id,
          user_id: record.user_id,
          created_by: record.created_by,
          updated_by: record.updated_by,
          is_deleted: record.is_deleted,
          created_at: record.created_at,
          updated_at: record.updated_at,
        };
      }
    });

    return { count: decryptedDocs.length, doc: decryptedDocs };
  } catch (error) {
    // Log error for debugging
    // console.error('Credit card getAll error:', error);

    return { errors: [ { name: 'getAll', message: 'An error occurred while fetching credit card data' } ] };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, updatedBy, ...newDoc } = payload;

    // Get existing record
    const existingRecord = await CreditCardModel.findOne({
      where: { public_id: publicId, is_deleted: false },
    });

    if (!existingRecord) {
      return { errors: [ { name: 'patch', message: 'No credit card record found' } ] };
    }

    // Parse existing encrypted data
    let existingData = {};

    try {
      existingData = JSON.parse(existingRecord.encrypted_id);
    } catch (error) {
      // console.error('Error parsing existing credit card data:', error);

      return { errors: [ { name: 'patch', message: 'Invalid existing data format' } ] };
    }

    // Merge with new data
    const convertedPayload = camelToSnake(newDoc);
    const mergedData = { ...existingData, ...convertedPayload };

    // Encrypt sensitive fields
    const encryptedPayload = encryptObject(mergedData, encryptionFields);
    const encryptedData = JSON.stringify(encryptedPayload);

    // Update the record
    const [ updatedCount ] = await CreditCardModel.update(
      {
        encrypted_id: encryptedData,
        updated_by: updatedBy,
      },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No credit card record found' } ] };
    }

    return { doc: { message: 'Credit card details successfully updated.', publicId } };
  } catch (error) {
    // Log error for debugging
    // console.error('Credit card patch error:', error);

    return { errors: [ { name: 'patch', message: 'An error occurred while updating credit card data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, updatedBy } = payload;

    const [ updatedCount ] = await CreditCardModel.update(
      { is_deleted: true, updated_by: updatedBy },
      { where: { public_id: publicId, is_deleted: false } },
    );

    if (!updatedCount) {
      return { errors: [ { name: 'deleted', message: 'No credit card record found' } ] };
    }

    return { doc: { message: 'Credit card details successfully deleted.' } };
  } catch (error) {
    // Log error for debugging
    // console.error('Credit card deleted error:', error);

    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting credit card data' } ] };
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
