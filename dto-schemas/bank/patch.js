const patch = {
  title: 'patch bank',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    bank_name: {
      type: 'string',
      description: 'Name of the bank',
    },
    account_number: {
      type: 'string',
      description: 'Account number of the user\'s bank',
    },
    account_holder: {
      type: 'string',
      description: 'Account holder name',
    },
    account_type: {
      type: 'string',
      description: 'Type of bank account (Savings, Current, etc.)',
    },
    ifsc_code: {
      type: 'string',
      description: 'IFSC code of the bank',
    },
    branch: {
      type: 'string',
      description: 'Branch of the user\'s bank',
    },
    phone_number: {
      type: 'string',
      description: 'Phone number associated with the account',
    },
    country: {
      type: 'string',
      description: 'Country where the bank is located',
    },
    currency: {
      type: 'string',
      description: 'Currency of the account',
    },
    document_path: {
      type: 'string',
      description: 'Path to uploaded document',
      nullable: true,
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
