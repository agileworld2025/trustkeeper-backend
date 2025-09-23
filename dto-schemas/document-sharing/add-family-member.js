const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      errorMessage: 'Name is required and must be at least 1 character',
    },
    email: {
      type: 'string',
      format: 'email',
      errorMessage: 'Email must be a valid email address',
    },
    phone: {
      type: 'string',
      pattern: '^[0-9+\\-\\s()]+$',
      errorMessage: 'Phone number must contain only numbers, +, -, spaces, and parentheses',
    },
    alternatePhone: {
      type: 'string',
      pattern: '^[0-9+\\-\\s()]+$',
      errorMessage: 'Alternate phone number must contain only numbers, +, -, spaces, and parentheses',
    },
    countryCode: {
      type: 'string',
      pattern: '^\\+[0-9]{1,4}$',
      errorMessage: 'Country code must start with + followed by 1-4 digits',
    },
    alternateCountryCode: {
      type: 'string',
      pattern: '^\\+[0-9]{1,4}$',
      errorMessage: 'Alternate country code must start with + followed by 1-4 digits',
    },
    address: {
      type: 'string',
      maxLength: 500,
      errorMessage: 'Address must be less than 500 characters',
    },
    relationType: {
      type: 'string',
      enum: ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 'Cousin', 'Friend', 'Other'],
      errorMessage: 'Relation type must be one of the valid options',
    },
    accessLevel: {
      type: 'string',
      enum: ['view_only', 'can_edit', 'full_access'],
      errorMessage: 'Access level must be view_only, can_edit, or full_access',
    },
    confirmEmail: {
      type: 'string',
      format: 'email',
      errorMessage: 'Confirm email must be a valid email address',
    },
  },
  required: ['name', 'email', 'relationType'],
  additionalProperties: false,
  if: {
    properties: {
      confirmEmail: { type: 'string' }
    }
  },
  then: {
    properties: {
      confirmEmail: {
        const: { $data: '1/email' },
        errorMessage: 'Confirm email must match email address'
      }
    }
  },
  errorMessage: {
    required: {
      name: 'Name is required',
      email: 'Email is required',
      relationType: 'Relation type is required',
    },
  },
};

const validate = ajv.compile(schema);

module.exports = validate;
