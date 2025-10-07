const save = {
  title: 'Save Bank Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
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
      default: 'US Dollar',
    },
    document_path: {
      type: 'string',
      description: 'Path to uploaded document',
      nullable: true,
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: [ 'bank_name', 'account_number', 'account_holder', 'account_type', 'ifsc_code' ],
  additionalProperties: false,
  errorMessage: {
    required: {
      bank_name: 'Parameter: bank_name is required',
      account_number: 'Parameter: account_number is required',
      account_holder: 'Parameter: account_holder is required',
      account_type: 'Parameter: account_type is required',
      ifsc_code: 'Parameter: ifsc_code is required',
    },
    properties: {
      bank_name: 'Parameter: bank_name should be valid',
      account_number: 'Parameter: account_number should be valid',
      account_holder: 'Parameter: account_holder should be valid',
      account_type: 'Parameter: account_type should be valid',
      ifsc_code: 'Parameter: ifsc_code should be valid',
      branch: 'Parameter: branch should be valid',
      phone_number: 'Parameter: phone_number should be valid',
      country: 'Parameter: country should be valid',
      currency: 'Parameter: currency should be valid',
      document_path: 'Parameter: document_path should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
