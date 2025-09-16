const deleted = {
  title: 'Delete Business Ownership',
  description: 'Defines the structure for HTTP DELETE request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['publicId'],
  additionalProperties: false,
};

module.exports = deleted;
