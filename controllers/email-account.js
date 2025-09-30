const EmailAccountService = require('../service/email-account');
const Validator = require('../utils/validator');
const { patch: patchSchema, save: saveSchema } = require('../dto-schemas/email-account/index');

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save email account details',
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

    const { doc, errors } = await EmailAccountService.save(validatedData);

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
        message: 'Relative cannot fetch email account details',
      });
    }

    const data = { userId };

    const { doc, errors } = await EmailAccountService.getAll(data);

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
        message: 'Relative cannot update email account details',
      });
    }

    const data = { ...body, updatedBy: userId, publicId };

    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: patchSchema,
    });

    if (validationErrors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: validationErrors });
    }

    const { doc, errors } = await EmailAccountService.patch(validatedData);

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
        message: 'Relative cannot delete email account details',
      });
    }

    const data = { updatedBy: userId, publicId };

    const { doc, errors } = await EmailAccountService.deleted(data);

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
