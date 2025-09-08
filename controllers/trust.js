const TrustService = require('../service/trust');

const save = async (req, res) => {
  try {
    const { body, auth: { userId, customerId } } = req;

    if (customerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot save trust details',
      });
    }

    const data = { ...body, userId };

    const { doc, errors } = await TrustService.save(data);

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
        message: 'Relative cannot fetch trust details',
      });
    }

    const data = { userId };

    const { doc, errors } = await TrustService.getAll(data);

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

const update = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { auth: { userId, customerId } } = req;
    const { body } = req;
    const isValidPublicId = publicId && publicId.length === 36;
    const isValidBody = body && Object.keys(body).length > 0;
    const isValidCustomerId = customerId && customerId.length === 36;
    const isValidUserId = userId && userId.length === 36;

    if (!isValidPublicId) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid public ID',
      });
    }
    if (!isValidBody) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request body',
      });
    }
    if (isValidCustomerId) {
      return res.status(400).json({
        status: 'error',
        message: 'Relative cannot update trust details',
      });
    }
    if (!isValidUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID',
      });
    }
    const { doc, errors } = await TrustService.update({ publicId, userId, ...body });

    if (doc) {
      res.setHeader('public-id', publicId);
      res.setHeader('message', 'Successfully updated.');
    }

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
      publicId,
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
    const { publicId } = req.params;
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
        message: 'Relative cannot delete trust details',
      });
    }

    const { doc, errors } = await TrustService.deleted({ publicId, userId });

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
  update,
  getAll,
  deleted,
};
