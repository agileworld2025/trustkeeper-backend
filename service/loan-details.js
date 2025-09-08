const { v1: uuidV1 } = require('uuid');
const { loan_details: LoanDetailsModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);

    await LoanDetailsModel.create({
      public_id: publicId,
      ...convertedPayload,
      user_id: convertedPayload.user_id,
      updated_by: convertedPayload.user_id,
      created_by: convertedPayload.user_id,
    });

    return {
      doc: {
        publicId,
        message: 'Loan details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'saveLoanDetails',
          message: 'An error occurred while saving Loan data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const LoanDetails = await LoanDetailsModel.findAll({
      where: { user_id: userId },
    });

    if (!LoanDetails.length) {
      return {
        errors: [
          {
            name: 'saveLoanDetails',
            message: 'No Loan details details found',
          },
        ],
      };
    }

    return {
      doc: LoanDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'Loan',
          message: 'An error occurred while fetching Loan details data',
        },
      ],
    };
  }
};

const update = async (payload) => {
  try {
    const {
      publicId,
      userId,
      ...rest
    } = payload;

    const existingDetails = await LoanDetailsModel.findOne({
      where: {
        public_id: publicId,
      },
    });

    if (!existingDetails) {
      return {
        errors: [
          {
            name: 'Not Found',
            message: 'Data Not Found',
          },
        ],
      };
    }

    const convertedPayload = camelToSnake(rest);

    const [ updatedCount ] = await LoanDetailsModel.update(
      {
        ...convertedPayload,
        updated_by: userId,

      },
      {
        where: { public_id: publicId },
      },
    );

    if (!updatedCount) {
      return {
        errors: [
          {
            name: 'patchLoanDetails',
            message: 'No Loan details details found',
          },
        ],
      };
    }

    return {
      doc: {
        publicId,
        message: 'Loan details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'LoanDetails',
          message: 'An error occurred while updating Loan details data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, userId } = payload;

    const existingDetail = await LoanDetailsModel.findOne({
      where: { public_id: publicId, user_id: userId, is_deleted: false },
    });

    if (!existingDetail) {
      return {
        errors: [
          {
            name: 'deleteLoanDetails',
            message: 'No Loan details found',
          },
        ],
      };
    }

    const [ deletedCount ] = await LoanDetailsModel.update(
      { is_deleted: true },
      {
        where: { public_id: publicId, user_id: userId },
      },
    );

    if (!deletedCount) {
      return {
        errors: {
          message: 'Something Went Wrong.',
          publicId,
        },
      };
    }

    return {
      doc: {
        publicId,
        message: 'Successfully Deleted',
      },

    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'deleteLoanDetails',
          message: 'An error occurred while deleting Loan data',
        },
      ],
    };
  }
};

module.exports = {
  save,
  getAll,
  update,
  deleted,
};
