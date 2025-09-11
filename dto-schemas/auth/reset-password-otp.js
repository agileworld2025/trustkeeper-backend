const resetPasswordOtp = {
  title: 'Reset password OTP verification form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'Email of user',
      format: 'email',
    },
    otp: {
      type: 'string',
      description: 'OTP received via email',
      pattern: '^[0-9]{6}$',
    },
    password: {
      type: 'string',
      description: 'New password',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,15}$',
    },
    confirmPassword: {
      const: {
        $data: '1/password',
      },
      type: 'string',
      description: 'Confirm password (must match password)',
    },
  },
  errorMessage: {
    required: {
      email: 'Email is required in the body.',
      otp: 'OTP is required in the body.',
      password: 'Password is required in the body.',
      confirmPassword: 'ConfirmPassword is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
      otp: 'OTP should be a 6-digit number.',
      password: 'Password should be valid. Must be 8 to 15 characters long with at least one lowercase, one uppercase, one special character, and one number.',
      confirmPassword: 'Parameter: confirmPassword should match the password.',
    },
  },
  required: ['email', 'otp', 'password', 'confirmPassword'],
  additionalProperties: false,
};

module.exports = resetPasswordOtp;
