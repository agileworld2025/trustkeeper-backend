const save = {
  title: 'Save Bank Details',
  description: 'Defines the structure for HTTP GET request body',
  type: 'object',
  properties: {
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
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
    image: {
      type: 'string',
      description: 'Image file path',
      nullable: true,
    },
  },
  required: [ 'name', 'accountNumber' ],
  additionalProperties: false,
  errorMessage: {
    required: {
      name: 'Parameter: name is required',
      accountNumber: 'Parameter: account number is required',
    },
    properties: {
      name: 'Parameter: name should be valid',
      accountNumber: 'Parameter: account number should be valid',
      branch: 'Parameter: branch should be valid',
      ownerName: 'Parameter: owner name should be valid',
      ifsc: 'Parameter: IFSC should be valid',
      userId: 'Parameter: userId should be valid',
      image: 'Parameter: image should be valid',
    },
  },
};

module.exports = save;
