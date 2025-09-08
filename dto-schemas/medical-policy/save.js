const save = {
  title: 'Save medical Policy Details',
  description: 'Defines the structure for HTTP GET request body',
  type: 'object',
  properties: {
    policyNumber: {
      type: 'string',
      description: 'Policy Number of the user’s medical Policy',
    },
    insuranseHoldername: {
      type: 'string',
      description: 'insuranse Holder name of the medical Policy',
    },
    dateOfCommence: {
      type: 'string',
      description: 'The date when the policy commenced (format: YYYY-MM-DD)',
    },
    premiumAmount: {
      type: 'string',
      description: 'The premium Amount to be received on policy maturity',
    },
    dateOfMaturity: {
      type: 'string',
      description: 'The date when the policy will mature (format: YYYY-MM-DD)',
    },
    coverAmount: {
      type: 'string',
      description: 'The cover Amount on policy',
    },
    frequency: {
      type: 'string',
      description: 'The frequency of the premium payment (e.g., monthly, quarterly, yearly)',
    },
    renewal: {
      type: 'string',
      description: 'The renewal date for the policy (format: YYYY-MM-DD)',
    },
    provider: {
      type: 'string',
      description: 'The policy provider',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator',
      format: 'uuid',
    },
    image: {
      type: 'string',
      description: 'Image file path',
      nullable: true,
    },
  },
  additionalProperties: false,
  errorMessage: {
    properties: {
      insuranseHoldername: 'Parameter: name should be valid',
      policyNumber: 'Parameter: account number should be valid',
      dateOfCommence: 'Parameter: date Of Commence should be valid',
      premiumAmount: 'Parameter: premium Amount should be valid',
      dateOfMaturity: 'Parameter: date Of Maturity should be valid',
      coverAmount: 'Parameter: cover Amount should be valid',
      frequency: 'Parameter: frequency should be vali',
      renewal: 'Parameter: renewal should be valid',
      provider: 'Parameter: provider should be valid',
      userId: 'Parameter: userId should be valid',
      image: 'Parameter: image should be valid',
    },
  },
};

module.exports = save;
