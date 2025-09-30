const save = {
  title: 'Save Social Media Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
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
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: [],
  additionalProperties: false,
};

module.exports = save;
