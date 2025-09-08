const { v1: uuidV1 } = require('uuid');
const { insurances: InsuranceModel } = require('../database');
const { encryptData, decryptData } = require('../utils/senitize-data');

const save = async (data) => {
  try {
    // const { doc, errors: encryptionErrors } = await encryptData(data);

    // if (encryptionErrors) {
    //   return { errors: encryptionErrors };
    // }

    const { userId } = data;

    const publicId = uuidV1();

    await InsuranceModel.create({
      user_id: userId, public_id: publicId, ...data,
    });

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    return { errors: [ { name: 'save', message: 'An error occurred while saving the insurance data' } ] };
  }
};

const getAll = async (payload) => {
  try {
    const { type } = payload;

    const whereClause = type ? { type } : {}; // If type exists, filter, else empty filter (fetch all)

    const response = await InsuranceModel.findAll({
      where: whereClause,
      order: [ [ 'created_at', 'DESC' ] ],
    });

    if (!response || response.length === 0) {
      return { errors: [ { name: 'getAll', message: 'No insurance data found' } ] };
    }

    return { doc: response };
  } catch (error) {
    console.error('Error in InsuranceService.getAll:', error);

    return { errors: [ { name: 'getAll', message: 'An error occurred while retrieving the insurance data' } ] };
  }
};

const patch = async (data) => {
  try {
    const response = await InsuranceModel.update(data, {
      where: { public_id: data.publicId },
    });

    if (!response) {
      return { errors: [ { name: 'patch', message: 'No insurance data found' } ] };
    }

    return { doc: response };
  } catch (error) {
    return { errors: [ { name: 'save', message: 'An error occurred while saving the insurance data' } ] };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId } = payload;
    const response = await InsuranceModel.destroy({
      where: { public_id: publicId },
    });

    if (!response) {
      return { errors: [ { name: 'deleted', message: 'No insurance data found' } ] };
    }

    return { doc: response };
  } catch (error) {
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting the insurance data' } ] };
  }
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
