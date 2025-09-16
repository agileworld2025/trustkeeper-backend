/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { business_ownership: BusinessOwnershipModel, sequelize } = require('../database');
const Helper = require('../utils/helper');

const { encryptData } = require('../utils/senitize-data');

const save = async (data) => {
  try {
    const { errors: encryptionErrors } = await encryptData(data);
    const convertedData = Helper.camelToSnake(data);

    if (encryptionErrors) {
      return { errors: encryptionErrors };
    }
    const publicId = uuidV1();

    await BusinessOwnershipModel.create({
      public_id: publicId,
      ...convertedData,
      user_id: convertedData.user_id,
      updated_by: convertedData.user_id,
      created_by: convertedData.user_id,
    });

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    console.error('Save error:', error.message);

    return { errors: [ { name: 'save', message: 'An error occurred while saving the business ownership data' } ] };
  }
};

const getAll = async (payload) => {
  const { userId, customerId } = payload;

  const response = await BusinessOwnershipModel.findAll({
    attributes: { exclude: [ 'id' ] },
    where: { user_id: customerId || userId, is_deleted: false },
  });

  if (!response) {
    return { count: 0, doc: [] };
  }

  const docs = response.map((element) => {
    const record = Helper.convertSnakeToCamel(element.dataValues);

    return record;
  });

  return { count: docs.length, doc: docs };
};

const patch = async (payload) => {
  const { publicId, updatedBy, ...newDoc } = payload;

  const transaction = await sequelize.transaction();

  try {
    const response = await BusinessOwnershipModel.findOne({
      where: { public_id: publicId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!response) {
      await transaction.rollback();

      return { errors: [ { name: 'BusinessOwnership', message: 'No record found.' } ] };
    }

    const convertedData = Helper.camelToSnake(newDoc);

    const { errors: encryptionErrors } = await encryptData(convertedData);

    if (encryptionErrors) {
      await transaction.rollback();

      return { errors: encryptionErrors };
    }

    await BusinessOwnershipModel.update(
      {
        ...convertedData,
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

    return { errors: [ { name: 'patch', message: 'An error occurred while updating the business ownership data.' } ] };
  }
};

const deleted = async (payload) => {
  const { publicId, updatedBy } = payload;

  const res = await BusinessOwnershipModel.findOne({
    where: { public_id: publicId },
  });

  if (res) {
    const { dataValues: { is_deleted: isDeleted } } = res;

    if (isDeleted) {
      return { errors: [ { name: 'publicId', message: 'already deleted!' } ] };
    }

    await BusinessOwnershipModel.update({ is_deleted: true, updated_by: updatedBy }, { where: { public_id: publicId } });

    return { doc: { message: 'successfully deleted!' } };
  }

  return { errors: [ { name: 'publicId', message: 'no business ownership found!' } ] };
};

module.exports = {
  save, getAll, patch, deleted,
};
