/* eslint-disable no-console */
const path = require('path');
const VehicleService = require('../service/vehicle');
const Validator = require('../utils/validator');
const { patch: patchSchema, save: saveSchema } = require('../dto-schemas/vehicle/index');
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
      ...(file ? { photos: [ file.path ] } : {}),
    };

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot save the customer vehicle' });
    }

    // Filter out unwanted properties and ensure proper types
    const filteredData = {
      vehicleType: data.vehicleType,
      ownershipDetails: data.ownershipDetails,
      value: data.value,
      currency: data.currency,
      insuranceDetails: data.insuranceDetails,
      leaseDetails: data.leaseDetails,
      country: data.country,
      documents: data.documents,
      photos: data.photos,
      userId: data.userId,
    };

    const { errors, data: validatedData } = Validator.isSchemaValid({
      data: { ...filteredData, image: file ? file.path : null },
      schema: saveSchema,
    });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await VehicleService.save(validatedData);

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

    const { count, doc } = await VehicleService.getAll({ userId, customerId });

    const transformedData = doc.map((item) => {
      // Handle photos URL transformation if photos exist
      if (item.photos && Array.isArray(item.photos)) {
        // eslint-disable-next-line no-param-reassign
        item.photos = item.photos.map((photo) => `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(photo)}`);
      }

      return {
        publicId: item.publicId,
        userId: item.userId,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        isDeleted: item.isDeleted,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        ...item,
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
    const { auth: { userId, customerId }, params: { publicId } } = req;

    const body = { ...req.body };

    // Convert string value to number if present
    if (body.value && typeof body.value === 'string') {
      body.value = parseFloat(body.value);
    }

    if (req.file) {
      body.photos = [ req.file.path ];
    }

    if (customerId) {
      return res.status(403).json({
        status: 'error',
        message: 'Relative cannot edit the customer vehicle',
      });
    }

    // Filter out unwanted properties and ensure proper types
    const filteredBody = {
      vehicleType: body.vehicleType,
      ownershipDetails: body.ownershipDetails,
      value: body.value,
      currency: body.currency,
      insuranceDetails: body.insuranceDetails,
      leaseDetails: body.leaseDetails,
      country: body.country,
      documents: body.documents,
      image: body.image,
      photos: body.photos,
    };

    const { errors, data } = Validator.isSchemaValid({
      data: { ...filteredBody, publicId, updatedBy: userId },
      schema: patchSchema,
    });

    if (errors) {
      return res.status(422).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    const { errors: err, doc } = await VehicleService.patch(data);

    if (err) {
      return res.status(422).json({
        status: 'error',
        message: 'Update failed',
        errors: err,
      });
    }

    if (!doc) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully updated',
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
    const { params: { publicId }, auth: { userId: updatedBy, customerId } } = req;

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative can not delete the customer vehicle' });
    }

    const data = { publicId, updatedBy };

    const { errors } = Validator.isSchemaValid({ data, schema: deletedSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await VehicleService.deleted(data);

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
