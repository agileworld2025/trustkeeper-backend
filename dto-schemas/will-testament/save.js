const save = {
  title: 'Save Will Testament Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    executor: {
      type: 'string',
      description: 'Name of the executor of the will',
      maxLength: 255,
    },
    country: {
      type: 'string',
      description: 'Country where the will is valid',
      maxLength: 100,
    },
    beneficiaries: {
      type: 'string',
      description: 'Details of beneficiaries in the will',
    },
    assetsDistribution: {
      type: 'string',
      description: 'How assets are to be distributed according to the will',
    },
    safeStorage: {
      type: 'string',
      description: 'Information about where the will is safely stored',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: ['executor'],
  additionalProperties: false,
  errorMessage: {
    required: {
      executor: 'Parameter: executor is required',
    },
    properties: {
      executor: 'Parameter: executor should be valid',
      country: 'Parameter: country should be valid',
      beneficiaries: 'Parameter: beneficiaries should be valid',
      assetsDistribution: 'Parameter: assets distribution should be valid',
      safeStorage: 'Parameter: safe storage should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
