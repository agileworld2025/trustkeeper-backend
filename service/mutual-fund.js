const { v1: uuidV1 } = require('uuid');
const { mutualFunds: MutualFundModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();

    await MutualFundModel.create({
      public_id: publicId,
      user_id: payload.userId,
      fund_house: payload.fundHouse,
      investment_type: payload.investmentType,
      folio_number: payload.folioNumber,
      country: payload.country,
      currency: payload.currency,
      sip_amount: payload.sipAmount,
      frequency: payload.frequency,
      maturity_date: payload.maturityDate,
      created_by: payload.userId,
    });

    return {
      doc: {
        publicId,
        message: 'Successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'save',
          message: 'An error occurred while saving mutual fund details',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  const { userId } = payload;

  const response = await MutualFundModel.findAll({
    where: { user_id: userId },
    order: [ [ 'created_at', 'DESC' ] ],
  });

  if (!response || response.length === 0) {
    return { errors: [ { name: 'getAll', message: 'No mutual fund data found' } ] };
  }

  return { doc: response };
};

const patch = async (payload) => {
  const { publicId, userId, ...updateData } = payload;
  const data = camelToSnake(updateData);

  const [ updatedCount ] = await MutualFundModel.update(data, {
    where: { public_id: publicId },
  });

  if (updatedCount === 0) {
    return {
      errors: [
        {
          name: 'update',
          message: 'No mutual fund data found to update',
        },
      ],
    };
  }

  return { doc: { message: 'Successfully updated.' } };
};

const deleted = async (payload) => {
  const { publicId } = payload;

  const deletedCount = await MutualFundModel.destroy({
    where: { public_id: publicId },
  });

  if (deletedCount === 0) {
    return {
      errors: [
        {
          name: 'delete',
          message: 'No mutual fund data found to delete',
        },
      ],
    };
  }

  return { doc: { message: 'Successfully deleted.' } };
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
