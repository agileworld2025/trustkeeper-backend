/* eslint-disable no-console */
const { v1: uuidV1 } = require('uuid');
const { transactions: TransactionsModel } = require('../database');
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

    await TransactionsModel.create({
      user_id: userId, public_id: publicId, encrypted_id: encryptDoc, created_by: userId,
    });

    return { doc: { publicId, message: 'successfully saved.' } };
  } catch (error) {
    console.error('Save error:', error.message);

    return { errors: [ { name: 'save', message: 'An error occurred while saving the Transactions data' } ] };
  }
};

const getAll = async (payload) => {
  const { userId } = payload;

  const response = await TransactionsModel.findAll({
    attributes: { exclude: [ 'id' ] },
    where: { user_id: userId },
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

module.exports = { save, getAll };
