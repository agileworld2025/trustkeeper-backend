const save = {
  title: 'Save LIC Details',
  description: 'Defines the structure for HTTP POST request body to save LIC policy details',
  type: 'object',
  properties: {
    policyNumber: {
      type: 'string',
      description: 'The unique number assigned to the policy',
    },
    policyHolderName: {
      type: 'string',
      description: 'The name of the policyholder',
    },
    dateOfCommence: {
      type: 'string',
      description: 'The date when the policy commenced (format: YYYY-MM-DD)',
    },
    premiumAmount: {
      type: 'string',
      description: 'The premium amount paid for the policy',
    },
    dateOfMaturity: {
      type: 'string',
      description: 'The date when the policy will mature (format: YYYY-MM-DD)',
    },
    sum_assuraed: {
      type: 'string',
      description: 'The sum assured by the policy',
    },
    bonusAssuraed: {
      type: 'string',
      description: 'The bonus assured in the policy',
    },
    frequency: {
      type: 'string',
      description: 'The frequency of the premium payment (e.g., monthly, quarterly, yearly)',
    },
    nextDueDate: {
      type: 'string',
      description: 'The next due date for the premium payment (format: YYYY-MM-DD)',
    },
    amount_on_maturity: {
      type: 'string',
      description: 'The amount to be received on policy maturity',
    },
    userId: {
      type: 'string',
      description: 'User ID of the creator (format: UUID)',
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
      policyNumber: 'Parameter: policy number should be valid',
      policyHolderName: 'Parameter: policy holder name should be valid',
      dateOfCommence: 'Parameter: date of commencement should be valid',
      premiumAmount: 'Parameter: premium amount should be valid',
      dateOfMaturity: 'Parameter: date of maturity should be valid',
      sum_assuraed: 'Parameter: sum assured should be valid',
      bonusAssuraed: 'Parameter: bonus assured should be valid',
      frequency: 'Parameter: frequency should be valid',
      nextDueDate: 'Parameter: next due date should be valid',
      amount_on_maturity: 'Parameter: amount on maturity should be valid',
      userId: 'Parameter: userId should be valid',
      image: 'Parameter: image should be valid',
    },
    required: {
      policyNumber: 'Parameter: policy number is required',
      policyHolderName: 'Parameter: policy holder name is required',
      userId: 'Parameter: userId is required',
    },
  },
};

module.exports = save;
