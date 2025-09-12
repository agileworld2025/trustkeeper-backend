const patch = {
  title: 'patch real estate',
  description: 'Defines the structure for HTTP patch request body',
  type: 'object',
  properties: {
    publicId: {
      type: 'string',
      format: 'uuid',
    },
    category: {
      type: 'string',
      description: 'Category of the real estate property',
      maxLength: 100,
    },
    leaseDetails: {
      type: 'string',
      description: 'Lease details of the property',
    },
    photos: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Array of photo URLs or paths',
    },
    documents: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Array of document URLs or paths',
    },
    currency: {
      type: 'string',
      description: 'Currency of the property value',
      maxLength: 20,
      default: 'USD',
    },
    propertyValue: {
      type: 'number',
      description: 'Value of the property',
      minimum: 0,
    },
    insuranceDetails: {
      type: 'string',
      description: 'Insurance details of the property',
    },
    mortgageDetails: {
      type: 'string',
      description: 'Mortgage details of the property',
    },
    ownershipDetails: {
      type: 'string',
      description: 'Ownership details of the property',
    },
    addressLine1: {
      type: 'string',
      description: 'Address line 1 of the property',
      maxLength: 255,
    },
    country: {
      type: 'string',
      description: 'Country where the property is located',
      maxLength: 100,
    },
    image: {
      type: 'string',
      description: 'Image path for the property',
    },
    updatedBy: {
      type: 'string',
      description: 'userId',
      format: 'uuid',
    },
  },
  required: ['publicId', 'updatedBy'],
  additionalProperties: false,
};

module.exports = patch;
