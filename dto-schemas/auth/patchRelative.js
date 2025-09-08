const patchRelative = {
  title: 'patch relative',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
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
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
};

module.exports = patchRelative;
