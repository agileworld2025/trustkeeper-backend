const { v1: uuidV1 } = require('uuid');
const { tax_details: TaxDetailsModel } = require('../database');
const { camelToSnake } = require('../utils/helper');

const save = async (payload) => {
  try {
    const publicId = uuidV1();
    const convertedPayload = camelToSnake(payload);
    const { taxIdNumber } = payload;
    const isDuplicateEntry = await TaxDetailsModel.findOne({
      where: {
        tax_id_number: taxIdNumber,
      },
    });

    if (isDuplicateEntry) {
      return {
        errors:
        {
          publicId,
          message: 'Duplicate Entry',
        },
      };
    }

    if (!isDuplicateEntry) {
      await TaxDetailsModel.create({
        public_id: publicId,
        ...convertedPayload,
        user_id: convertedPayload.user_id,
        updated_by: convertedPayload.user_id,
        created_by: convertedPayload.user_id,
      });
    }

    return {
      doc: {
        publicId,
        message: 'Tax details successfully saved.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'savetaxDetails',
          message: 'An error occurred while saving tax data',
        },
      ],
    };
  }
};

const getAll = async (payload) => {
  try {
    const { userId } = payload;

    const taxDetails = await TaxDetailsModel.findAll({
      where: {
        user_id: userId,
        is_deleted: false,
      },
    });

    if (!taxDetails.length) {
      return {
        errors: [
          {
            name: 'savetaxDetails',
            message: 'No tax details details found',
          },
        ],
      };
    }

    return {
      doc: taxDetails,
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'Tax',
          message: 'An error occurred while fetching Tax details data',
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

    const existingDetails = await TaxDetailsModel.findOne({
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

    const [ updatedCount ] = await TaxDetailsModel.update(
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
            name: 'patchTaxDetails',
            message: 'No Tax details details found',
          },
        ],
      };
    }

    return {
      doc: {
        publicId,
        message: 'Tax details successfully updated.',
      },
    };
  } catch (error) {
    return {
      errors: [
        {
          name: 'TaxDetails',
          message: 'An error occurred while updating Tax details data',
        },
      ],
    };
  }
};

const deleted = async (payload) => {
  try {
    const { publicId, userId } = payload;

    const existingDetail = await TaxDetailsModel.findOne({
      where: { public_id: publicId, user_id: userId, is_deleted: false },
    });

    if (!existingDetail) {
      return {
        errors: [
          {
            name: 'deleteTaxDetails',
            message: 'No Tax details found',
          },
        ],
      };
    }

    const [ deletedCount ] = await TaxDetailsModel.update(
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
          name: 'deleteTaxDetails',
          message: 'An error occurred while deleting Tax data',
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
