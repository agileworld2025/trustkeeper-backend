const patch = {
  title: 'patch business ownership',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    businessName: {
      type: 'string',
      description: 'Name of the business',
      maxLength: 255,
    },
    businessType: {
      type: 'string',
      description: 'Type of business (LLC, Corporation, Partnership, etc.)',
      maxLength: 100,
    },
    ownershipPercentage: {
      oneOf: [
        { type: 'string', pattern: '^[0-9]+(\.[0-9]+)?$' },
        { type: 'number', minimum: 0, maximum: 100 },
      ],
      description: 'Percentage of ownership in the business',
    },
    businessValue: {
      oneOf: [
        { type: 'string', pattern: '^[0-9]+(\.[0-9]+)?$' },
        { type: 'number', minimum: 0 },
      ],
      description: 'Estimated or current value of the business',
    },
    currency: {
      type: 'string',
      description: 'Currency of the business value',
      maxLength: 10,
      default: 'USD',
    },
    businessAddress: {
      type: 'string',
      description: 'Business address information',
    },
    registrationNumber: {
      type: 'string',
      description: 'Business registration or tax ID number',
      maxLength: 100,
    },
    country: {
      type: 'string',
      description: 'Country where business is registered',
      maxLength: 100,
    },
    businessDocuments: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Array of uploaded business documents (.pdf, .docx, etc.)',
    },
    photos: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Array of business photos',
    },
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: true,
};

module.exports = patch;
