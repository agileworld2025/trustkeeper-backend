const patch = {
  title: 'patch credit card',
  description: 'Schema for edit bank details including card information',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    bankName: {
      type: 'string',
      description: 'Name of the bank',
    },
    cardNumber: {
      type: 'string',
      description: 'Credit or debit card number associated with the account',
    },
    branch: {
      type: 'string',
      description: 'Branch of the bank where the account is held',
    },
    ownerName: {
      type: 'string',
      description: 'Name of the account owner',
    },
    availableBalance: {
      type: 'string',
      description: 'Current available balance in the account',
    },
    currency: {
      type: 'string',
      description: 'Currency type of the account balance (e.g., USD, EUR)',
    },
    duedate: {
      type: 'string',
      description: 'Due date for any outstanding payments (format: YYYY-MM-DD)',
    },
    country: {
      type: 'string',
      description: 'Country where the bank account is registered',
    },
    APR: {
      type: 'string',
      description: 'Annual Percentage Rate (APR) for the account',
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
