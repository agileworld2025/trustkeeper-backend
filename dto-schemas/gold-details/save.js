const save = {
  title: 'save gold',
  description: 'Defines the structure for HTTP POST request body for gold details',
  type: 'object',
  properties: {
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
    userId: {
      type: 'string',
      description: 'User ID of the person saving the record',
      format: 'uuid',
    },
  },
  required: [ 'lockerDetails', 'serviceProvider', 'value', 'country', 'userId' ],
  additionalProperties: true,
};

module.exports = save;
