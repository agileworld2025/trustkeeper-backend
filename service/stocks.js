const { v1: uuidV1 } = require('uuid');
const { stockMarketDetails: StockMarketDetailsModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();

    const {
      brokerageAccountDetails,
      country,
      dematAccountInformation,
      stockHoldingsWithPurchasePrice,
      currentValue,
      userId,
    } = payload;

    await StockMarketDetailsModel.create({
      public_id: publicId,
      brokerage_account_details: brokerageAccountDetails,
      country,
      demat_account_information: dematAccountInformation,
      stock_holdings_with_purchase_price: stockHoldingsWithPurchasePrice,
      current_value: currentValue,
      created_by: userId,
      user_id: userId,
      updated_by: userId,
    });

    return {
      doc: {
        publicId,
        message: 'Stock market details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveStockMarket',
          message: 'An error occurred while saving stock market data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const stockMarketDetails = await StockMarketDetailsModel.findAll({
      where: { user_id: userId },
    });

    if (!stockMarketDetails.length) {
      return {
        errors: [
          {
            name: 'getStockMarket',
            message: 'No stock market data found',
          },
        ],
      };
    }

    return {
      doc: stockMarketDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'getStockMarket',
          message: 'An error occurred while fetching stock market data',
        },
      ],
    };
  }
};

const patch = async (payload) => {
  try {
    const { publicId, body, userId } = payload;

    const updateData = camelToSnake(body);

    updateData.updated_by = userId;

    const [ updatedCount ] = await StockMarketDetailsModel.update(updateData, {
      where: { public_id: publicId },
    });

    if (updatedCount === 0) {
      return {
        errors: [
          {
            name: 'updateStockMarket',
            message: 'No stock market data found to update',
          },
        ],
      };
    }

    return {
      doc: {
        message: 'Stock market details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'updateStockMarket',
          message: 'An error occurred while updating stock market data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId } = payload;

    const deletedCount = await StockMarketDetailsModel.destroy({
      where: { public_id: publicId },
    });

    if (deletedCount === 0) {
      return {
        errors: [
          {
            name: 'deleteStockMarket',
            message: 'No stock market data found to delete',
          },
        ],
      };
    }

    return {
      doc: {
        message: 'Stock market details successfully deleted.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteStockMarket',
          message: 'An error occurred while deleting stock market data',
        },
      ],
    };
  }
};

module.exports = {
  save,
  patch,
  getAll,
  deleted,
};

