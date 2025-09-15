/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const path = require('path');
const GoldService = require('../service/gold-details');
const Validator = require('../utils/validator');
const { patch: patchSchema, save: saveSchema } = require('../dto-schemas/gold-details/index');
const { deleted: deletedSchema } = require('../dto-schemas/bank');

const save = async (req, res) => {
  try {
    const { body, file, auth: { userId, customerId } } = req;

    // Convert string value to number if present
    if (body.value && typeof body.value === 'string') {
      body.value = parseFloat(body.value);
    }

    const data = {
      ...body,
      userId,
      ...(file ? { documentPath: file.path } : {}),
    };

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot save customer gold details' });
    }

    // Filter relevant fields
    const filteredData = {
      lockerDetails: data.lockerDetails,
      serviceProvider: data.serviceProvider,
      location: data.location,
      documentPath: data.documentPath,
      value: data.value,
      country: data.country,
      userId: data.userId,
    };

    const { errors, data: validatedData } = Validator.isSchemaValid({
      data: filteredData,
      schema: saveSchema,
    });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors });
    }

    const { errors: err, doc } = await GoldService.save(validatedData);

    if (doc) {
      const { publicId } = doc;

      res.setHeader('public-id', publicId);
      res.setHeader('message', 'successfully saved.');

      return res.status(201).json({ status: 'success', message: 'successfully saved.' });
    }

    return res.status(400).json({ status: 'error', message: 'Save failed', errors: err });
  } catch (error) {
    console.error('Save error:', error);

    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const { auth: { userId, customerId } } = req;

    const { count, doc } = await GoldService.getAll({ userId, customerId });

    const transformedData = doc.map((item) => {
      if (item.documentPath) {
        item.documentPath = `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(item.documentPath)}`;
      }

      return item;
    });

    res.setHeader('x-coreplatform-paging-limit', count);
    res.setHeader('x-coreplatform-total-records', count);

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('GetAll error:', error);

    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const patch = async (req, res) => {
  try {
    const { auth: { userId, customerId }, params: { publicId } } = req;

    const body = { ...req.body };

    if (body.value && typeof body.value === 'string') {
      body.value = parseFloat(body.value);
    }

    if (req.file) {
      body.documentPath = req.file.path;
    }

    if (customerId) {
      return res.status(403).json({ status: 'error', message: 'Relative cannot edit customer gold details' });
    }

    const filteredBody = {
      lockerDetails: body.lockerDetails,
      serviceProvider: body.serviceProvider,
      location: body.location,
      documentPath: body.documentPath,
      value: body.value,
      country: body.country,
    };

    const { errors, data } = Validator.isSchemaValid({
      data: { ...filteredBody, publicId, updatedBy: userId },
      schema: patchSchema,
    });

    if (errors) {
      return res.status(422).json({ status: 'error', message: 'Validation failed', errors });
    }

    const { errors: err, doc } = await GoldService.patch(data);

    if (err) {
      return res.status(422).json({ status: 'error', message: 'Update failed', errors: err });
    }

    if (!doc) {
      return res.status(404).json({ status: 'error', message: 'Gold record not found' });
    }

    return res.status(200).json({ status: 'success', message: 'Successfully updated' });
  } catch (error) {
    console.error('Patch error:', error);

    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const deleted = async (req, res) => {
  try {
    const { params: { publicId }, auth: { userId: updatedBy, customerId } } = req;

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot delete customer gold details' });
    }

    const data = { publicId, updatedBy };

    const { errors } = Validator.isSchemaValid({ data, schema: deletedSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors });
    }

    const { errors: err, doc } = await GoldService.deleted(data);

    if (doc) {
      res.setHeader('message', 'successfully deleted!');

      return res.status(200).json({ status: 'success', message: 'Successfully deleted!' });
    }

    return res.status(400).json({ status: 'error', message: 'Delete failed', errors: err });
  } catch (error) {
    console.error('Delete error:', error);

    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
