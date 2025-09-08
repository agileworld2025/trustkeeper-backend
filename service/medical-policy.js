/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { medical_policy: medicalPolicyModel, sequelize } = require('../database');
const Helper = require('../utils/helper');

const { encryptData, decryptData } = require('../utils/senitize-data');

const save = async (data) => {
  try {
    const { doc, errors: encryptionErrors } = await encryptData(data);

    if (encryptionErrors) {
      return { errors: encryptionErrors };
    }

    const { encryptDoc } = doc;
    const { userId } = data;

    const publicId = uuidV1();

    await medicalPolicyModel.create({
      user_id: userId, public_id: publicId, encrypted_id: encryptDoc, created_by: userId,
    });

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    console.error('Save error:', error.message);

    return { errors: [ { name: 'save', message: 'An error occurred while saving the bank data' } ] };
  }
};

const getAll = async (payload) => {
  const { userId, customerId } = payload;

  const response = await medicalPolicyModel.findAll({
    attributes: { exclude: [ 'id' ] },
    where: { user_id: customerId || userId, is_deleted: false },
  });

  if (!response) {
    return { count: 0, doc: [] };
  }

  const decryptedDocs = await Promise.all(
    response.map(async (element) => {
      const record = Helper.convertSnakeToCamel(element.dataValues);

      const { data: decryptedData, errors: decryptionErrors } = await decryptData(record.encryptedId);

      if (decryptionErrors) {
        console.error(`Decryption error for encryptedData: ${record.encryptedId}`);
        record.decryptedData = null;
      } else {
        record.decryptedData = decryptedData;
      }

      delete record.encryptedId;

      return record;
    }),
  );

  return { count: decryptedDocs.length, doc: decryptedDocs };
};

const patch = async (payload) => {
  const { publicId, updatedBy, ...newDoc } = payload;

  const transaction = await sequelize.transaction();

  try {
    const response = await medicalPolicyModel.findOne({
      where: { public_id: publicId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!response) {
      await transaction.rollback();

      return { errors: [ { name: 'Bank', message: 'No record found.' } ] };
    }

    const { encrypted_id: encryptedId } = response.dataValues;
    const { data: decryptedData, errors: decryptionErrors } = await decryptData(encryptedId);

    if (decryptionErrors) {
      await transaction.rollback();

      return { errors: decryptionErrors };
    }

    let existingData;

    try {
      existingData = typeof decryptedData.data === 'string'
        ? JSON.parse(decryptedData.data)
        : decryptedData.data;
    } catch (error) {
      await transaction.rollback();
      console.error('Failed to parse decrypted data:', error);

      return { errors: [ { name: 'decryptData', message: 'Invalid decrypted data format.' } ] };
    }

    const mergedData = { ...existingData, ...newDoc };

    const { doc, errors: encryptionErrors } = await encryptData(mergedData);
    const { encryptDoc } = doc;

    if (encryptionErrors) {
      await transaction.rollback();

      return { errors: encryptionErrors };
    }

    await medicalPolicyModel.update(
      {
        encrypted_id: encryptDoc,
        updated_by: updatedBy,
      },
      {
        where: { public_id: publicId },
        transaction,
      },
    );
    await transaction.commit();

    return { doc: { message: 'Successfully updated.', publicId } };
  } catch (error) {
    await transaction.rollback();
    console.error('Patch error:', error.message);

    return { errors: [ { name: 'patch', message: 'An error occurred while updating the bank data.' } ] };
  }
};

const deleted = async (payload) => {
  const { publicId, updatedBy } = payload;

  const res = await medicalPolicyModel.findOne({
    where: { public_id: publicId },
  });

  if (res) {
    const { dataValues: { is_deleted: isDeleted } } = res;

    if (isDeleted) {
      return { errors: [ { name: 'publicId', message: 'already deleted!' } ] };
    }

    await medicalPolicyModel.update({ is_deleted: true, updated_by: updatedBy }, { where: { public_id: publicId } });

    return { doc: { message: 'successfully deleted!' } };
  }

  return { errors: [ { name: 'publicId', message: 'no bank found!' } ] };
};

module.exports = {
  save, getAll, patch, deleted,
};
