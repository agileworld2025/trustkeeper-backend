const patch = {
  title: 'Patch Credit Card Details',
  description: 'Schema for updating credit card information',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
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
