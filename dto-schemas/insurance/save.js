const save = {
  title: 'Save Insurance Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    type: {
      type: 'string',
      description: 'Type of insurance',
      enum: ['car-insurance', 'home-insurance', 'travel-insurance', 'business-insurance'],
    },
    policyNumber: {
      type: 'string',
      description: 'Policy number',
    },
    expiryDate: {
      type: 'string',
      format: 'date',
      description: 'Expiry date of the policy',
    },
    claimedBenefit: {
      type: 'string',
      description: 'Claimed benefit details',
    },
    coverageDetails: {
      type: 'string',
      description: 'Coverage details',
    },
    country: {
      type: 'string',
      description: 'Country selection',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: ['type', 'policyNumber', 'expiryDate', 'claimedBenefit', 'coverageDetails', 'country'],
  additionalProperties: false,
};

module.exports = save;
