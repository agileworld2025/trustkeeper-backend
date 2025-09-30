const patch = {
  title: 'Update Will Testament Details',
  description: 'Defines the structure for HTTP PATCH request body',
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
    publicId: {
      type: 'string',
      description: 'Public ID of the will record to update',
      format: 'uuid',
    },
    updatedBy: {
      type: 'string',
      description: 'User ID of the updater',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
  additionalProperties: false,
  errorMessage: {
    required: {
      publicId: 'Parameter: publicId is required',
      updatedBy: 'Parameter: updatedBy is required',
    },
    properties: {
      executor: 'Parameter: executor should be valid',
      country: 'Parameter: country should be valid',
      beneficiaries: 'Parameter: beneficiaries should be valid',
      assetsDistribution: 'Parameter: assets distribution should be valid',
      safeStorage: 'Parameter: safe storage should be valid',
      publicId: 'Parameter: publicId should be valid',
      updatedBy: 'Parameter: updatedBy should be valid',
    },
  },
};

module.exports = patch;
