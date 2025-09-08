const registerRelative = {
  title: 'User Relative register through `email` form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'Email of user',
      format: 'email',
      pattern: '^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
    },
    name: {
      type: 'string',
      description: 'name of user',
    },
    relationType: {
      type: 'string',
      description: 'relation type',
    },
    mobileNumber: {
      type: 'string',
      description: 'mobileNumber',
    },
    country: {
      type: 'string',
      description: 'country',
    },
    state: {
      type: 'string',
      description: 'state',
    },
    pincode: {
      type: 'string',
      description: 'pincode',
    },
    addressLine1: {
      type: 'string',
      description: 'addressLine1',
    },
    addressLine2: {
      type: 'string',
      description: 'addressLine1',
    },
    customerUserId: {
      type: 'string',
      description: 'user Id of customer',
    },
  },
  errorMessage: {
    required: {
      email: 'Parameter: email is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
      name: 'Parameter: name should be valid.',
      relationType: 'Parameter: relationType should be valid.',
      customerUserId: 'Parameter: userId should be valid.',
    },
  },
  required: [ 'email' ],
  additionalProperties: false,
};

module.exports = registerRelative;
