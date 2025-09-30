const save = {
  title: 'Credit Card Details Schema',
  description: 'Schema for saving credit card information',
  type: 'object',
  properties: {
    cardNumber: {
      type: 'string',
      description: 'Credit card number',
    },
    cardHolderName: {
      type: 'string',
      description: 'Name of the card holder',
    },
    bankName: {
      type: 'string',
      description: 'Name of the bank issuing the card',
    },
    expiryDate: {
      type: 'string',
      description: 'Card expiry date (format: MM/YY)',
    },
    country: {
      type: 'string',
      description: 'Country where the card is registered',
    },
    userId: {
      type: 'string',
      description: 'Unique identifier for the user',
      format: 'uuid',
    },
  },
  required: [ 'cardNumber', 'cardHolderName', 'bankName', 'expiryDate', 'country', 'userId' ],
  additionalProperties: false,
  errorMessage: {
    properties: {
      cardNumber: 'Parameter: card number should be valid',
      cardHolderName: 'Parameter: card holder name should be valid',
      bankName: 'Parameter: bank name should be valid',
      expiryDate: 'Parameter: expiry date should be valid (format: MM/YY)',
      country: 'Parameter: country should be valid',
      userId: 'Parameter: userId should be a valid UUID',
    },
  },
};

module.exports = save;
