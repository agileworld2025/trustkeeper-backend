const deleted = {
  title: 'Delete Email Account',
  description: 'Defines the structure for HTTP DELETE request',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: ['publicId', 'userId'],
  additionalProperties: false,
};

module.exports = deleted;
