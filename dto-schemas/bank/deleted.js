const deleted = {
  title: 'deleted form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      description: 'publicId',
      format: 'uuid',
    },
    updatedBy: {
      type: 'string',
      description: 'updatedBy',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
  additionalProperties: false,
};

module.exports = deleted;
