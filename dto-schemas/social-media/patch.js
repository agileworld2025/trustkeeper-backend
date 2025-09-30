const patch = {
  title: 'Patch Social Media Details',
  description: 'Defines the structure for HTTP PATCH request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    facebookUsername: {
      type: 'string',
      description: 'Facebook username',
    },
    facebookPassword: {
      type: 'string',
      description: 'Facebook password',
    },
    instagramUsername: {
      type: 'string',
      description: 'Instagram username',
    },
    instagramPassword: {
      type: 'string',
      description: 'Instagram password',
    },
    linkedinUsername: {
      type: 'string',
      description: 'LinkedIn username',
    },
    linkedinPassword: {
      type: 'string',
      description: 'LinkedIn password',
    },
    xUsername: {
      type: 'string',
      description: 'X (Twitter) username',
    },
    xPassword: {
      type: 'string',
      description: 'X (Twitter) password',
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
