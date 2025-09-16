/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const path = require('path');
const BusinessOwnershipService = require('../service/business-ownership');
const Validator = require('../utils/validator');
const { save: saveSchema, patch: patchSchema } = require('../dto-schemas/business-ownership');

const save = async (req, res) => {
  try {
    const { body, files, auth: { userId, customerId } } = req;

    if (body.businessValue && typeof body.businessValue === 'string') {
      body.businessValue = parseFloat(body.businessValue);
    }

    if (body.ownershipPercentage && typeof body.ownershipPercentage === 'string') {
      body.ownershipPercentage = parseFloat(body.ownershipPercentage);
    }

    const data = {
      ...body,
      userId,
      ...(files ? { businessDocuments: files.map((file) => file.path) } : {}),
    };

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot save the customer business ownership' });
    }

    const filteredData = {
      businessName: data.businessName,
      businessType: data.businessType,
      ownershipPercentage: data.ownershipPercentage,
      businessValue: data.businessValue,
      currency: data.currency,
      businessAddress: data.businessAddress,
      registrationNumber: data.registrationNumber,
      country: data.country,
      businessDocuments: data.businessDocuments,
      photos: data.photos,
      userId: data.userId,
    };

    const { errors, data: validatedData } = Validator.isSchemaValid({
      data: { ...filteredData },
      schema: saveSchema,
    });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await BusinessOwnershipService.save(validatedData);

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

    const { count, doc } = await BusinessOwnershipService.getAll({ userId, customerId });

    const transformedData = doc.map((item) => {
      // Transform document paths to full URLs
      if (item.businessDocuments && Array.isArray(item.businessDocuments)) {
        item.businessDocuments = item.businessDocuments.map((docPath) => `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(docPath)}`);
      }

      // Transform photo paths to full URLs
      if (item.photos && Array.isArray(item.photos)) {
        item.photos = item.photos.map((photo) => `${req.protocol}://${req.get('host')}/api/uploads/${path.basename(photo)}`);
      }

      return item;
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

    if (body.businessValue && typeof body.businessValue === 'string') {
      body.businessValue = parseFloat(body.businessValue);
    }

    if (body.ownershipPercentage && typeof body.ownershipPercentage === 'string') {
      body.ownershipPercentage = parseFloat(body.ownershipPercentage);
    }

    if (req.files && req.files.length > 0) {
      body.businessDocuments = req.files.map((file) => file.path);
    }

    if (customerId) {
      return res.status(403).json({
        status: 'error',
        message: 'Relative cannot edit the customer business ownership',
      });
    }

    const filteredBody = {
      businessName: body.businessName,
      businessType: body.businessType,
      ownershipPercentage: body.ownershipPercentage,
      businessValue: body.businessValue,
      currency: body.currency,
      businessAddress: body.businessAddress,
      registrationNumber: body.registrationNumber,
      country: body.country,
      businessDocuments: body.businessDocuments,
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

    const { errors: err, doc } = await BusinessOwnershipService.patch(data);

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
        message: 'Business ownership not found',
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

    if (!publicId) {
      return res.status(400).json({ status: 'error', message: 'Invalid public ID' });
    }

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative can not delete the customer business ownership' });
    }

    const data = { publicId, updatedBy };

    const { errors: err, doc } = await BusinessOwnershipService.deleted(data);

    if (err) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors: err });
    }

    if (doc) {
      res.setHeader('message', 'successfully deleted!');

      return res.status(200).json({ status: 'success', message: 'Successfully deleted!' });
    }

    return res.status(404).json({ status: 'error', message: 'Business ownership not found' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  save, getAll, patch, deleted,
};
