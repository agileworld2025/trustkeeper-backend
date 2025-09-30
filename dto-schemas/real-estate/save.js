const save = {
  title: 'Save Real Estate Details',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
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
      oneOf: [
        { type: 'string' },
        { type: 'null' }
      ],
      description: 'Image path for the property',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
  },
  required: ['category', 'userId'],
  additionalProperties: false,
  errorMessage: {
    required: {
      category: 'Parameter: category is required',
      userId: 'Parameter: userId is required',
    },
    properties: {
      category: 'Parameter: category should be valid',
      leaseDetails: 'Parameter: lease details should be valid',
      photos: 'Parameter: photos should be valid',
      documents: 'Parameter: documents should be valid',
      currency: 'Parameter: currency should be valid',
      propertyValue: 'Parameter: property value should be valid',
      insuranceDetails: 'Parameter: insurance details should be valid',
      mortgageDetails: 'Parameter: mortgage details should be valid',
      ownershipDetails: 'Parameter: ownership details should be valid',
      addressLine1: 'Parameter: address line 1 should be valid',
      country: 'Parameter: country should be valid',
      image: 'Parameter: image should be valid',
      userId: 'Parameter: userId should be valid',
    },
  },
};

module.exports = save;
