const patch = {
  title: 'patch bank',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    name: {
      type: 'string',
      description: 'Name of the bank',
    },
    code: {
      type: 'string',
      description: 'Bank code',
    },
    accountNumber: {
      type: 'string',
      description: 'Account number of the user’s bank',
    },
    branch: {
      type: 'string',
      description: 'Branch of the user’s bank',
    },
    nominees: {
      type: 'array',
      items: {
        type: 'object',
        required: [ 'name' ],
        properties: {
          name: {
            type: 'string',
            description: 'Nominee’s name',
          },
          mobileNumber: {
            type: 'string',
            description: 'Nominee’s mobile number',
          },
          dob: {
            type: [ 'string', 'null' ],
            description: 'Date of birth of the nominee',
            oneOf: [
              {
                format: 'date',
              },
            ],
          },
          email: {
            type: [ 'string', 'null' ],
            format: 'email',
            maxLength: 50,
            minLength: 2,
            transform: [ 'trim', 'toLowerCase' ],
            description: 'Nominee’s email address',
          },
          relationship: {
            type: 'string',
            description: 'Relationship to the account holder',
          },
        },
      },
    },
    ownerName: {
      type: 'string',
      description: 'Owner name of the user’s bank account',
    },
    ifsc: {
      type: 'string',
      description: 'IFSC code of the bank',
    },
    currency: {
      type: 'string',
      description: 'Currency of the account',
    },
    country: {
      type: 'string',
      description: 'Country where the bank is located',
    },
    info: {
      type: 'object',
      description: 'Additional information',
    },
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
  additionalProperties: false,
};

module.exports = patch;
