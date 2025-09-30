const InsuranceService = require('../service/insurance');
const Validator = require('../utils/validator');
const { save: saveSchema, patch: patchSchema } = require('../dto-schemas/insurance');

const validInsuranceTypes = [ 'car-insurance', 'home-insurance', 'travel-insurance', 'business-insurance' ];

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;
    const { type } = body;
    const isValidType = validInsuranceTypes.includes(type);

    if (!isValidType) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid insurance type',
        valid_types: validInsuranceTypes,

      });
    }

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save the customer insurance',
      });
    }

    const data = { ...body, userId };

    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: saveSchema,
    });

    if (validationErrors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: validationErrors });
    }

    const { doc, errors } = await InsuranceService.save(validatedData);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    const { publicId } = doc;

    res.setHeader('public-id', publicId);
    res.setHeader('message', 'successfully saved.');

    return res.status(201).json({
      status: 'success',
      message: 'successfully saved.',
      publicId,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

const getAll = async (req, res) => {
  try {
    const { query: { type } } = req;

    if (type && !validInsuranceTypes.includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid insurance type',
        valid_types: validInsuranceTypes,
      });
    }

    const { doc, errors } = await InsuranceService.getAll({ type });

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully fetched.',
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

const patch = async (req, res) => {
  try {
    const { params: { publicId }, body, auth: { userId } } = req;

    const data = {
      ...body,
      publicId,
      updatedBy: userId,
    };

    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: patchSchema,
    });

    if (validationErrors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: validationErrors });
    }

    const { doc, errors } = await InsuranceService.patch(validatedData);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'successfully updated.',
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

const deleted = async (req, res) => {
  try {
    const { params: { publicId } } = req;

    const { doc, errors } = await InsuranceService.deleted({ publicId });

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'successfully deleted.',
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

module.exports = {
  save,
  getAll,
  patch,
  deleted,
};
