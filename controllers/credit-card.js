/* eslint-disable no-console */
const path = require('path');
const CreditCardService = require('../service/credit-card');
const Validator = require('../utils/validator');
const { save: saveSchema, patch: patchSchema } = require('../dto-schemas/credit-card');

const save = async (req, res) => {
  try {
    const { body, file, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save credit card details',
      });
    }

    const data = { ...body, userId, upload_credit_card: file ? file.path : null };

    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: saveSchema,
    });

    if (validationErrors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: validationErrors });
    }

    const { doc, errors } = await CreditCardService.save(validatedData);

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
        message: 'Relative cannot fetch credit card details',
      });
    }

    const data = { userId, customerId };

    const { doc, errors } = await CreditCardService.getAll(data);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    // Transform document paths to full URLs
    const transformedData = doc.map((item) => {
      const transformedItem = { ...item };

      if (transformedItem.upload_credit_card) {
        transformedItem.upload_credit_card = `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(transformedItem.upload_credit_card)}`;
      }

      return transformedItem;
    });

    return res.status(200).json(transformedData);
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

    if (req.file) {
      body.upload_credit_card = req.file.path;
    }

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot update credit card details',
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

    const { doc, errors } = await CreditCardService.patch(validatedData);

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
        message: 'Relative cannot delete credit card details',
      });
    }

    const data = { updatedBy: userId, publicId };

    const { doc, errors } = await CreditCardService.deleted(data);

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
