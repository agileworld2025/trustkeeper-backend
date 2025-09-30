const patch = {
  title: 'Patch Insurance Details',
  description: 'Defines the structure for HTTP PATCH request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
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
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: false,
};

module.exports = patch;
