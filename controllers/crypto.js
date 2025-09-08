const CryptoService = require('../service/crypto');

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save crypto details',
      });
    }

    const data = { ...body, userId };

    const { doc, errors } = await CryptoService.save(data);

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
    const { auth: { userId } } = req;

    const data = await CryptoService.getAll(userId);

    if (data.errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: data.errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved.',
      data,
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

    const data = { ...body, userId, publicId };

    const { doc, errors } = await CryptoService.patch(data);

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
    const { params: { publicId }, auth: { userId } } = req;

    const { doc } = await CryptoService.deleted({ userId, publicId });

    if (doc.errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: doc.errors,
      });
    }
    const data = { ...doc, publicId };

    if (data.errors) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: data.errors,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Successfully deleted.',
      data,
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
