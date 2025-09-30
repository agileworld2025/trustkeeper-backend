const save = {
  title: 'Save Term Insurance Details',
  description: 'Defines the structure for HTTP POST request body to save term insurance details',
  type: 'object',
  properties: {
    policyNumber: {
      type: 'string',
      description: 'Policy Number of the term insurance',
    },
    premiumAmount: {
      type: 'number',
      description: 'The premium amount for the term insurance',
    },
    sumAssured: {
      type: 'number',
      description: 'The sum assured amount',
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
  required: ['policyNumber', 'premiumAmount', 'sumAssured', 'providerName', 'beneficiaryName', 'country', 'userId'],
  additionalProperties: false,
  errorMessage: {
    properties: {
      policyNumber: 'Parameter: policy number should be valid',
      premiumAmount: 'Parameter: premium amount should be valid',
      sumAssured: 'Parameter: sum assured should be valid',
      providerName: 'Parameter: provider name should be valid',
      beneficiaryName: 'Parameter: beneficiary name should be valid',
      country: 'Parameter: country should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
