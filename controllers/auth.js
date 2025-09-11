const authService = require('../service/auth');
const Validator = require('../utils/validator');
const {
  register: registerSchema, verification: verificationSchema, setPassword: setPasswordSchema, login: loginSchema, forgotPassword: forgotPasswordSchema,
  resetPasswordOtp: resetPasswordOtpSchema, registerRelative: registerRelativeSchema, patchRelative: patchRelativeSchema,
} = require('../dto-schemas/auth');

const register = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: registerSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.register(data);

    if (doc) {
      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const registerRelative = async (req, res) => {
  try {
    const { auth: { userId: customerUserId }, body } = req;

    const data = { ...body, customerUserId };

    const { errors } = Validator.isSchemaValid({ data, schema: registerRelativeSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.registerRelative(data);

    if (doc) {
      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const patchRelative = async (req, res) => {
  try {
    const { body, auth: { userId, customerId }, params: { publicId } } = req;

    if (customerId) {
      return res.status(400).json({ status: 'error', message: 'Relative cannot edit the customer bank' });
    }

    const { errors, data } = Validator.isSchemaValid({
      data: { ...body, publicId, updatedBy: userId },
      schema: patchRelativeSchema,
    });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.patchRelative(data);

    if (doc) {
      res.setHeader('message', 'successfully updated.');

      return res.status(200).json({ status: 'success', message: 'successfully updated.' });
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getRelatives = async (req, res) => {
  try {
    const { auth: { userId: customerUserId } } = req;

    const { err, doc } = await authService.getRelatives(customerUserId);

    if (doc) {
      return res.status(200).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Could not fetch relatives', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const verification = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: verificationSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.verification(data);

    if (doc) {
      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const setPassword = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: setPasswordSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.setPassword(data);

    if (doc) {
      res.setHeader('message', 'Password set successfully!');

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const createMFA = async (req, res) => {
  try {
    const { auth: { userId: updatedBy, userId } } = req;

    const data = { updatedBy, userId };

    const { doc, error } = await authService.createMFA(data);

    if (doc) {
      const { qr, secret } = doc;

      res.setHeader('qr', qr);
      res.setHeader('secret', secret);

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', error });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const verifyMFA = async (req, res) => {
  try {
    const {
      auth: { userId: updatedBy, userId },
      body: { otp, secret },
    } = req;

    const data = {
      updatedBy, otp, secret, userId,
    };

    const { doc, error } = await authService.verifyMFA(data);

    if (doc) {
      const { isVerified } = doc;

      res.setHeader('is-verified', isVerified);

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', error });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: loginSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.login(data);

    if (doc) {
      const { accessToken, refreshToken } = doc;

      res.setHeader('token', accessToken);
      res.setHeader('refresh-token', refreshToken);
      res.setHeader('message', 'You have been successfully logged-in.');

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: forgotPasswordSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.forgotPassword(data);

    if (doc) {
      const { message } = doc;

      res.setHeader('message', message);

      return res.status(200).json({ status: 'success', message });
    }

    return res.status(400).json({ status: 'error', message: 'Request failed', errors: err });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Forgot password controller error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: resetPasswordOtpSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.resetPasswordWithOtp(data);

    if (doc) {
      res.setHeader('message', 'Password reset successfully!');

      return res.status(200).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Request failed', errors: err });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Reset password controller error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { auth: { userId } } = req;

    const { doc, errors } = await authService.getUserDetails({ userId });

    if (doc) {
      return res.status(200).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  register,
  verification,
  setPassword,
  login,
  createMFA,
  verifyMFA,
  forgotPassword,
  resetPasswordWithOtp,
  registerRelative,
  patchRelative,
  getRelatives,
  getUserDetails,
};
