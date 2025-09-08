const registration = {
  title: 'User registration through `name`, `email`, `password`, and `confirmPassword` form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Full name of user',
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: 'string',
      description: 'Email of user',
      format: 'email',
      // pattern: '^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
    },
    password: {
      type: 'string',
      description: 'Password for user account',
      minLength: 8,
      maxLength: 128,
    },
    confirmPassword: {
      type: 'string',
      description: 'Password confirmation',
      minLength: 8,
      maxLength: 128,
    },
  },
  errorMessage: {
    required: {
      name: 'Parameter: name is required in the body.',
      email: 'Parameter: email is required in the body.',
      password: 'Parameter: password is required in the body.',
      confirmPassword: 'Parameter: confirmPassword is required in the body.',
    },
    properties: {
      name: 'Parameter: name should be between 2 and 100 characters.',
      email: 'Parameter: email should be valid.',
      password: 'Parameter: password should be between 8 and 128 characters.',
      confirmPassword: 'Parameter: confirmPassword should be between 8 and 128 characters.',
    },
  },
  required: [ 'name', 'email', 'password', 'confirmPassword' ],
  additionalProperties: false,
};

module.exports = registration;
