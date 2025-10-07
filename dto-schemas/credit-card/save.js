const save = {
  title: 'Save Credit Card Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    card_number: {
      type: 'string',
      description: 'Credit card number',
    },
    card_holder_name: {
      type: 'string',
      description: 'Name of the card holder',
    },
    bank_name: {
      type: 'string',
      description: 'Name of the bank issuing the card',
    },
    expiry_date: {
      type: 'string',
      description: 'Card expiry date (format: MM/YY)',
    },
    country: {
      type: 'string',
      description: 'Country where the card is registered',
    },
    branch: {
      type: 'string',
      description: 'Bank branch',
    },
    available_balance: {
      type: 'string',
      description: 'Available balance on the card',
    },
    upload_credit_card: {
      type: 'string',
      description: 'Path to uploaded credit card image',
      nullable: true,
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: [ 'card_number', 'card_holder_name', 'bank_name', 'expiry_date', 'country', 'userId' ],
  additionalProperties: false,
  errorMessage: {
    required: {
      card_number: 'Parameter: card_number is required',
      card_holder_name: 'Parameter: card_holder_name is required',
      bank_name: 'Parameter: bank_name is required',
      expiry_date: 'Parameter: expiry_date is required',
      country: 'Parameter: country is required',
      userId: 'Parameter: userId is required',
    },
    properties: {
      card_number: 'Parameter: card_number should be valid',
      card_holder_name: 'Parameter: card_holder_name should be valid',
      bank_name: 'Parameter: bank_name should be valid',
      expiry_date: 'Parameter: expiry_date should be valid (format: MM/YY)',
      country: 'Parameter: country should be valid',
      branch: 'Parameter: branch should be valid',
      available_balance: 'Parameter: available_balance should be valid',
      upload_credit_card: 'Parameter: upload_credit_card should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
