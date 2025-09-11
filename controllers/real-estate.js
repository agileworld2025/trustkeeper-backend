/* eslint-disable no-console */
const path = require('path');
const RealEstateService = require('../service/real-estate');
const Validator = require('../utils/validator');
const { save: saveSchema, patch: patchSchema, deleted: deletedSchema } = require('../dto-schemas/bank');

const save = async (req, res) => {
  try {
    const { body, file, auth: { userId, customerId } } = req;
    const data = {
      ...body,
      userId,
      ...(file ? { image: file.path } : {}),
    };

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot save the customer real estate' });
    }

    // const { errors, data } = Validator.isSchemaValid({
    //   data: { ...body, userId, image: file ? file.path : null },
    //   schema: saveSchema,
    // });

    // if (errors) {
    //   return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    // }

    const { errors: err, doc } = await RealEstateService.save(data);

    if (doc) {
      const { publicId } = doc;

      res.setHeader('public-id', publicId);
      res.setHeader('message', 'successfully saved.');

      return res.status(201).json({ status: 'success', message: 'successfully saved.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const { auth: { userId, customerId } } = req;

    const { count, doc } = await RealEstateService.getAll({ userId, customerId });

    const transformedData = doc.map((item) => {
      // Handle image URL transformation if image exists
      if (item.image) {
        item.image = `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(item.image)}`;
      }

      return {
        publicId: item.publicId,
        userId: item.userId,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        isDeleted: item.isDeleted,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        ...item, // Include all other fields directly
      };
    });

    res.setHeader('x-coreplatform-paging-limit', count);
    res.setHeader('x-coreplatform-total-records', count);

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error in getAll:', error);

    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const patch = async (req, res) => {
  try {
    const { body, auth: { userId, customerId }, params: { publicId } } = req;

    if (req.file) {
      body.image = req.file.path;
    }

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot edit the customer real estate' });
    }

    const { errors, data } = Validator.isSchemaValid({
      data: { ...body, publicId, updatedBy: userId },
      schema: patchSchema,
    });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await RealEstateService.patch(data);

    if (err) {
      return res.badRequest('field-validation', err);
    }

    if (doc) {
      res.setHeader('message', 'successfully updated.');

      return res.status(200).json({ status: 'success', message: 'successfully updated.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const deleted = async (req, res) => {
  try {
    const { params: { publicId }, auth: { userId: updatedBy, customerId } } = req;

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative can not delete the customer real estate' });
    }

    const data = { publicId, updatedBy };

    const { errors } = Validator.isSchemaValid({ data, schema: deletedSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await RealEstateService.deleted(data);

    if (doc) {
      res.setHeader('message', 'successfully deleted!');

      return res.status(200).json({ status: 'success', message: 'Successfully deleted!' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
