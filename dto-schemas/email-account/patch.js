const patch = {
  title: 'Patch Email Account',
  description: 'Defines the structure for HTTP PATCH request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    email1Username: {
      type: 'string',
      description: 'Username for Email 1',
    },
    email1Password: {
      type: 'string',
      description: 'Password for Email 1',
    },
    email2Username: {
      type: 'string',
      description: 'Username for Email 2',
    },
    email2Password: {
      type: 'string',
      description: 'Password for Email 2',
    },
    email3Username: {
      type: 'string',
      description: 'Username for Email 3',
    },
    email3Password: {
      type: 'string',
      description: 'Password for Email 3',
    },
    email4Username: {
      type: 'string',
      description: 'Username for Email 4',
    },
    email4Password: {
      type: 'string',
      description: 'Password for Email 4',
    },
    country: {
      type: 'string',
      description: 'Country selection',
    },
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: false,
};

module.exports = patch;
