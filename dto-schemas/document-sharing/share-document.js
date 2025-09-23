const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

const schema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      format: 'uuid',
      errorMessage: 'User ID must be a valid UUID'
    },
    documentType: {
      type: 'string',
      enum: [
        'will_testament',
        'business_ownership',
        'real_estate',
        'mutual_fund',
        'stocks',
        'crypto',
        'fixed_deposit',
        'gold_details',
        'insurance',
        'lic',
        'medical_policy',
        'term_insurance',
        'credit_card',
        'loan_details',
        'tax_details',
        'vehicle',
        'power_attorney',
        'trust_details',
        'legal_advisor'
      ],
      errorMessage: 'Invalid document type'
    },
    documentId: {
      type: 'string',
      format: 'uuid',
      errorMessage: 'Document ID must be a valid UUID'
    },
    sharedWithEmail: {
      type: 'string',
      format: 'email',
      errorMessage: 'Email must be a valid email address'
    },
    relativeId: {
      type: 'string',
      format: 'uuid',
      errorMessage: 'Relative ID must be a valid UUID'
    },
    accessLevel: {
      type: 'string',
      enum: ['read_only', 'view_only'],
      default: 'read_only',
      errorMessage: 'Access level must be either read_only or view_only'
    },
    expiresAt: {
      type: 'string',
      format: 'date-time',
      errorMessage: 'Expiration date must be a valid ISO date string'
    },
    message: {
      type: 'string',
      maxLength: 1000,
      errorMessage: 'Message cannot exceed 1000 characters'
    }
  },
  required: ['documentType', 'documentId'],
  anyOf: [
    { required: ['sharedWithEmail'] },
    { required: ['relativeId'] }
  ],
  additionalProperties: true,
  errorMessage: {
    required: {
      documentType: 'Document type is required',
      documentId: 'Document ID is required'
    },
    anyOf: 'Either sharedWithEmail or relativeId must be provided'
  }
};

const validate = ajv.compile(schema);

module.exports = validate;
