const patch = {
  title: 'patch vehicle',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    vehicleType: {
      type: 'string',
      description: 'Type of vehicle (car, motorcycle, truck, etc.)',
      maxLength: 50,
    },
    ownershipDetails: {
      type: 'string',
      description: 'Ownership information',
    },
    value: {
      oneOf: [
        { type: 'string', pattern: '^[0-9]+(\.[0-9]+)?$' },
        { type: 'number', minimum: 0 },
      ],
      description: 'Estimated or current value of the vehicle',
    },
    currency: {
      type: 'string',
      description: 'Currency of the vehicle value',
      maxLength: 20,
      default: 'USD',
    },
    insuranceDetails: {
      type: 'string',
      description: 'Insurance policy details and information',
    },
    leaseDetails: {
      type: 'string',
      description: 'Lease information if applicable',
    },
    country: {
      type: 'string',
      description: 'Country where vehicle is registered',
      maxLength: 100,
    },
    documents: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Array of uploaded vehicle documents (.pdf, .docx, etc.)',
    },
    image: {
      oneOf: [
        { type: 'string' },
        { type: 'null' },
      ],
      description: 'Image path for the vehicle (optional)',
    },
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: [ 'publicId', 'updatedBy' ],
  additionalProperties: true,
};

module.exports = patch;
