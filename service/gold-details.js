/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { gold_details: GoldModel, sequelize } = require('../database');
const Helper = require('../utils/helper');
const { encryptData } = require('../utils/senitize-data');
const { camelToSnake } = require('../utils/helper');

const save = async (data) => {
  try {
    const { errors: encryptionErrors } = await encryptData(data);
    const convertedData = camelToSnake(data);

    if (encryptionErrors) {
      return { errors: encryptionErrors };
    }

    const publicId = uuidV1();

    await GoldModel.create({
      public_id: publicId,
      ...convertedData,
      user_id: convertedData.user_id,
      updated_by: convertedData.user_id,
      created_by: convertedData.user_id,
    });

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    console.error('Gold Save error:', error.message);

    return { errors: [ { name: 'save', message: 'An error occurred while saving gold details' } ] };
  }
};

const getAll = async ({ userId, customerId }) => {
  const response = await GoldModel.findAll({
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
    const response = await GoldModel.findOne({
      where: { public_id: publicId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!response) {
      await transaction.rollback();

      return { errors: [ { name: 'Gold', message: 'No record found.' } ] };
    }

    const convertedData = camelToSnake(newDoc);
    const { errors: encryptionErrors } = await encryptData(convertedData);

    if (encryptionErrors) {
      await transaction.rollback();

      return { errors: encryptionErrors };
    }

    await GoldModel.update(
      { ...convertedData, updated_by: updatedBy },
      { where: { public_id: publicId }, transaction },
    );

    await transaction.commit();

    return { doc: { message: 'Successfully updated.', publicId } };
  } catch (error) {
    await transaction.rollback();
    console.error('Gold Patch error:', error.message);

    return { errors: [ { name: 'patch', message: 'An error occurred while updating gold details.' } ] };
  }
};

const deleted = async ({ publicId, updatedBy }) => {
  const res = await GoldModel.findOne({ where: { public_id: publicId } });

  if (res) {
    if (res.dataValues.is_deleted) {
      return { errors: [ { name: 'publicId', message: 'Already deleted!' } ] };
    }

    await GoldModel.update({ is_deleted: true, updated_by: updatedBy }, { where: { public_id: publicId } });

    return { doc: { message: 'Successfully deleted!' } };
  }

  return { errors: [ { name: 'publicId', message: 'No gold record found!' } ] };
};

module.exports = {
  save, getAll, patch, deleted,
};
