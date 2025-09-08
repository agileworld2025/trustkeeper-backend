const save = {
  title: 'Save Transactions Details',
  description: 'Defines the structure for HTTP GET request body',
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
    // jisse liya hai ya dena hai uska nam
    nameOfPerson: {
      type: 'string',
      description: 'name of Person Transactions',
    },
    mobileNumberOfPerson: {
      type: 'string',
      description: 'mobile Number Of person Transactions',
    },
    type: {
      // dendar hai ya lendar
      type: 'string',
      description: 'type of Transactions',
      enum: [ 'lender', 'debtor' ],
    },
    interest: {
      // kitne interest pai liya ya diya hai
      type: 'string',
      description: 'interest of Transactions',
    },
    amount: {
      type: 'string',
      description: 'amount of Transactions',
    },
  },
  required: [ 'nameOfPerson', 'type' ],
  additionalProperties: false,
  errorMessage: {
    properties: {
      nameOfPerson: 'Parameter: nameOfPerson should be valid',
      type: 'Parameter: type should be valid',
      mobileNumberOfPerson: 'Parameter: mobileNumberOfPerson should be valid',
      interest: 'Parameter: interest should be valid',
      amount: 'Parameter: amount should be valid',
    },
    required: {
      nameOfPerson: 'Parameter: nameOfPerson is required',
      type: 'Parameter: type is required',
      amount: 'Parameter: amount is required',
    },
  },
};

module.exports = save;
