const WillService = require('../service/will');
const Validator = require('../utils/validator');
const { save: saveSchema, patch: patchSchema, deleted: deletedSchema } = require('../dto-schemas/will-testament');

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save will details',
      });
    }

    const data = { ...body, userId };

    // Validate input data using DTO schema
    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: saveSchema,
    });

    if (validationErrors) {
      return res.status(400).json({
        status: 'error',
        message: 'Field validation failed',
        errors: validationErrors,
      });
    }

    const { doc, errors } = await WillService.save(validatedData);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    const { publicId } = doc;

    res.setHeader('public-id', publicId);
    res.setHeader('message', 'Successfully saved.');

    return res.status(201).json({
      status: 'success',
      message: 'Successfully saved.',
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
    const { auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot fetch will details',
      });
    }

    const data = { userId };

    const { doc, errors } = await WillService.getAll(data);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

const update = async (req, res) => {
  try {
    const { body, auth: { userId, customerId }, params: { publicId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot update will details',
      });
    }

    const data = { ...body, userId, publicId, updatedBy: userId };

    // Validate input data using DTO schema
    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: patchSchema,
    });

    if (validationErrors) {
      return res.status(400).json({
        status: 'error',
        message: 'Field validation failed',
        errors: validationErrors,
      });
    }

    const { doc, errors } = await WillService.patch(validatedData);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json(doc);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
const deleted = async (req, res) => {
  try {
    const { auth: { userId, customerId }, params: { publicId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot delete will details',
      });
    }

    const data = { userId, publicId, updatedBy: userId };

    // Validate input data using DTO schema
    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: deletedSchema,
    });

    if (validationErrors) {
      return res.status(400).json({
        status: 'error',
        message: 'Field validation failed',
        errors: validationErrors,
      });
    }

    const { doc, errors } = await WillService.deleted(validatedData);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json(doc);
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
  update,
  deleted,
};
