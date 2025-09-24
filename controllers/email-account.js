const EmailAccountService = require('../service/email-account');

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

    const { doc, errors } = await EmailAccountService.save(data);

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

    const data = { ...body, userId, publicId };

    const { doc, errors } = await EmailAccountService.update(data);

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

    const data = { userId, publicId };

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
