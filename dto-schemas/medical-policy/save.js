const save = {
  title: 'Save Medical Policy Details',
  description: 'Defines the structure for HTTP POST request body to save medical policy details',
  type: 'object',
  properties: {
    policyNumber: {
      type: 'string',
      description: 'Policy Number of the medical policy',
    },
    premiumAmount: {
      type: 'number',
      description: 'The premium amount for the medical policy',
    },
    coverageAmount: {
      type: 'number',
      description: 'The coverage amount of the policy',
    },
    providerName: {
      type: 'string',
      description: 'The insurance provider name',
    },
    beneficiaryName: {
      type: 'string',
      description: 'The beneficiary name',
    },
    country: {
      type: 'string',
      description: 'Country where the policy is registered',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: ['policyNumber', 'premiumAmount', 'coverageAmount', 'providerName', 'beneficiaryName', 'country', 'userId'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      policyNumber: 'Parameter: policy number should be valid',
      premiumAmount: 'Parameter: premium amount should be valid',
      coverageAmount: 'Parameter: coverage amount should be valid',
      providerName: 'Parameter: provider name should be valid',
      beneficiaryName: 'Parameter: beneficiary name should be valid',
      country: 'Parameter: country should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
