/* eslint-disable no-console */
const path = require('path');
const BankService = require('../service/bank');
const Validator = require('../utils/validator');
const { save: saveSchema, patch: patchSchema } = require('../dto-schemas/bank');

const save = async (req, res) => {
  try {
    const { body, file, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save bank details',
      });
    }

    const data = { ...body, userId, document_path: file ? file.path : null };

    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({
      data: { ...data },
      schema: saveSchema,
    });

    if (validationErrors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: validationErrors });
    }

    const { doc, errors } = await BankService.save(validatedData);

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
        message: 'Relative cannot fetch bank details',
      });
    }

    const data = { userId, customerId };

    const { doc, errors } = await BankService.getAll(data);

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

      if (transformedItem.document_path) {
        transformedItem.document_path = `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(transformedItem.document_path)}`;
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
      body.document_path = req.file.path;
    }

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot update bank details',
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

    const { doc, errors } = await BankService.patch(validatedData);

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
        message: 'Relative cannot delete bank details',
      });
    }

    const data = { updatedBy: userId, publicId };

    const { doc, errors } = await BankService.deleted(data);

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
