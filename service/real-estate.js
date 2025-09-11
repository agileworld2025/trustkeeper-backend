/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { real_estate_records: RealEstateModel, sequelize } = require('../database');
const Helper = require('../utils/helper');

const { encryptData, decryptData } = require('../utils/senitize-data');
const { camelToSnake } = require('../utils/helper');

const save = async (data) => {
  try {
    const { errors: encryptionErrors } = await encryptData(data);
    const convertedData = camelToSnake(data);

    if (encryptionErrors) {
      return { errors: encryptionErrors };
    }
    const publicId = uuidV1();

    await RealEstateModel.create({
      public_id: publicId,
      ...convertedData,
      user_id: convertedData.user_id,
      updated_by: convertedData.user_id,
      created_by: convertedData.user_id,
    });

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    console.error('Save error:', error.message);

    return { errors: [ { name: 'save', message: 'An error occurred while saving the real estate data' } ] };
  }
};

const getAll = async (payload) => {
  const { userId, customerId } = payload;

  const response = await RealEstateModel.findAll({
    attributes: { exclude: [ 'id' ] },
    where: { user_id: customerId || userId, is_deleted: false },
  });

  if (!response) {
    return { count: 0, doc: [] };
  }

  const docs = response.map((element) => {
    const record = Helper.convertSnakeToCamel(element.dataValues);

    delete record.encryptedId;

    return record;
  });

  return { count: docs.length, doc: docs };
};

const patch = async (payload) => {
  const { publicId, updatedBy, ...newDoc } = payload;

  const transaction = await sequelize.transaction();

  try {
    const response = await RealEstateModel.findOne({
      where: { public_id: publicId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!response) {
      await transaction.rollback();

      return { errors: [ { name: 'RealEstate', message: 'No record found.' } ] };
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

    await RealEstateModel.update(
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

    return { errors: [ { name: 'patch', message: 'An error occurred while updating the real estate data.' } ] };
  }
};

const deleted = async (payload) => {
  const { publicId, updatedBy } = payload;

  const res = await RealEstateModel.findOne({
    where: { public_id: publicId },
  });

  if (res) {
    const { dataValues: { is_deleted: isDeleted } } = res;

    if (isDeleted) {
      return { errors: [ { name: 'publicId', message: 'already deleted!' } ] };
    }

    await RealEstateModel.update({ is_deleted: true, updated_by: updatedBy }, { where: { public_id: publicId } });

    return { doc: { message: 'successfully deleted!' } };
  }

  return { errors: [ { name: 'publicId', message: 'no real estate record found!' } ] };
};

module.exports = {
  save, getAll, patch, deleted,
};
