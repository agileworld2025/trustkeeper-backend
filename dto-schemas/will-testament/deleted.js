const deleted = {
  title: 'Delete Will Testament Details',
  description: 'Defines the structure for HTTP DELETE request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      description: 'Public ID of the will record to delete',
      format: 'uuid',
    },
    updatedBy: {
      type: 'string',
      description: 'User ID of the deleter',
      format: 'uuid',
    },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: false,
  errorMessage: {
    required: {
      publicId: 'Parameter: publicId is required',
      updatedBy: 'Parameter: updatedBy is required',
    },
    properties: {
      publicId: 'Parameter: publicId should be valid',
      updatedBy: 'Parameter: updatedBy should be valid',
    },
  },
};

module.exports = deleted;
