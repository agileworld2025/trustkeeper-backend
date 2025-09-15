const patch = {
  title: 'patch gold',
  description: 'Defines the structure for HTTP PATCH request body for gold details',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    lockerDetails: {
      type: 'string',
      description: 'Locker details where gold is kept',
      maxLength: 255,
    },
    serviceProvider: {
      type: 'string',
      description: 'Service provider or bank name',
      maxLength: 255,
    },
    location: {
      type: 'string',
      description: 'Location of locker/service provider',
      maxLength: 255,
    },
    documentPath: {
      type: 'string',
      description: 'Path or URL of uploaded gold document (.pdf, .docx, etc.)',
      maxLength: 500,
    },
    value: {
      oneOf: [
        { type: 'string', pattern: '^[0-9]+(\\.[0-9]+)?$' },
        { type: 'number', minimum: 0 },
      ],
      description: 'Estimated or current value of the gold',
    },
    country: {
      type: 'string',
      description: 'Country where gold is located',
      maxLength: 100,
    },
    updatedBy: {
      type: 'string',
      description: 'User ID of the person updating the record',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
  additionalProperties: true,
};

module.exports = patch;
