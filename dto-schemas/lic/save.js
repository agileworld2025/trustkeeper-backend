const save = {
  title: 'Save LIC Details',
  description: 'Defines the structure for HTTP POST request body to save LIC policy details',
  type: 'object',
  properties: {
    policyNumber: {
      type: 'string',
      description: 'The unique number assigned to the policy',
    },
    premiumAmount: {
      type: 'number',
      description: 'The premium amount paid for the policy',
    },
    maturityAmount: {
      type: 'number',
      description: 'The amount to be received on policy maturity',
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
      description: 'User ID of the creator (format: UUID)',
      format: 'uuid',
    },
  },
  required: ['policyNumber', 'premiumAmount', 'maturityAmount', 'providerName', 'beneficiaryName', 'country', 'userId'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      policyNumber: 'Parameter: policy number should be valid',
      premiumAmount: 'Parameter: premium amount should be valid',
      maturityAmount: 'Parameter: maturity amount should be valid',
      providerName: 'Parameter: provider name should be valid',
      beneficiaryName: 'Parameter: beneficiary name should be valid',
      country: 'Parameter: country should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
