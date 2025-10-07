const { v1: uuidV1 } = require('uuid');
const { credit_card: CreditCardModel } = require('../database');
const { camelToSnake } = require('../utils/helper');
const { encryptObject, decryptArray } = require('../utils/encryption');
const { credit_card: encryptionFields } = require('../config/encryption-fields');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    // Encrypt sensitive fields before saving to database
    const encryptedPayload = encryptObject(convertedPayload, encryptionFields);

    // Ensure user_id is properly set
    const userId = convertedPayload.user_id || payload.userId;

    await CreditCardModel.create({
      public_id: publicId,
      ...encryptedPayload,
      user_id: userId,
      updated_by: userId,
      created_by: userId,
    });

    return {
      doc: {
        publicId,
        message: 'Credit card details successfully saved.',
      },
    };
  } catch (error) {
    console.error('Credit card save error:', error);
    console.error('Error stack:', error.stack);

    return {
      errors: [
        {
          name: 'saveCreditCard',
          message: 'An error occurred while saving credit card data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId, customerId } = payload;

    const creditCardDetails = await CreditCardModel.findAll({
      where: {
        user_id: customerId || userId,
        is_deleted: false,
      },
    });

    if (!creditCardDetails.length) {
      return {
        errors: [
          {
            name: 'getCreditCard',
            message: 'No credit card details found',
          },
        ],
      };
    }

    // Convert to plain objects and decrypt sensitive fields before returning to user
    const plainRecords = creditCardDetails.map((r) => r.get({ plain: true }));
    const decryptedDetails = decryptArray(plainRecords, encryptionFields);

    return {
      doc: decryptedDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getCreditCard',
          message: 'An error occurred while fetching credit card data',
        },
      ],
    };
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

    const [ updatedCount ] = await CreditCardModel.update(updateData, {
      where: { public_id: publicId, is_deleted: false },
    });

    if (!updatedCount) {
      return { errors: [ { name: 'patch', message: 'No credit card record found' } ] };
    }

    return { doc: { message: 'Credit card details successfully updated.', publicId } };
  } catch (error) {
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
    return { errors: [ { name: 'deleted', message: 'An error occurred while deleting credit card data' } ] };
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
