const save = {
  title: 'Save Email Account Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
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
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: [],
  additionalProperties: false,
  errorMessage: {
    properties: {
      email1Username: 'Parameter: email1Username should be valid',
      email1Password: 'Parameter: email1Password should be valid',
      email2Username: 'Parameter: email2Username should be valid',
      email2Password: 'Parameter: email2Password should be valid',
      email3Username: 'Parameter: email3Username should be valid',
      email3Password: 'Parameter: email3Password should be valid',
      email4Username: 'Parameter: email4Username should be valid',
      email4Password: 'Parameter: email4Password should be valid',
      country: 'Parameter: country should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
