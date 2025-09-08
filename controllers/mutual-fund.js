const MutualFundService = require('../service/mutual-fund');
// const Validator = require('../utils/validator');
// const { save: saveSchema } = require('../dto-schemas/insurance');

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save mutual fund details',
      });
    }

    const data = { ...body, userId };

    const { doc, errors } = await MutualFundService.save(data);

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
        message: 'Relative cannot fetch mutual fund details',
      });
    }

    const data = { userId };

    const { doc, errors } = await MutualFundService.getAll(data);

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
    const { params: { publicId }, body } = req;
    const { auth: { userId, customerId } } = req;

    if (!publicId) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid public ID',
      });
    }

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot update mutual fund details',
      });
    }

    const data = { ...body, publicId, userId };

    const { doc, errors } = await MutualFundService.patch(data);

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully updated.',
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

    if (!publicId) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid public ID',
      });
    }

    const { doc, errors } = await MutualFundService.deleted({ publicId });

    if (errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully deleted.',
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
