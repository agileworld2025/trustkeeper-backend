const save = {
  title: 'Bank Details Schema',
  description: 'Schema for saving bank details including card information',
  type: 'object',
  properties: {
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
    userId: {
      type: 'string',
      description: 'Unique identifier for the user',
      format: 'uuid',
    },
    image: {
      type: 'string',
      description: 'Image file path',
      nullable: true,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      bankName: 'Parameter: bankName should be valid',
      cardNumber: 'Parameter: cardNumber should be valid',
      branch: 'Parameter: branch should be valid',
      ownerName: 'Parameter: owner name should be valid',
      availableBalance: 'Parameter: available balance should be valid',
      currency: 'Parameter: currency should be valid',
      duedate: 'Parameter: due date should be valid (format: YYYY-MM-DD)',
      country: 'Parameter: country should be valid',
      APR: 'Parameter: APR should be valid',
      userId: 'Parameter: userId should be a valid UUID',
      image: 'Parameter: image should be valid',
    },
  },
};

module.exports = save;
