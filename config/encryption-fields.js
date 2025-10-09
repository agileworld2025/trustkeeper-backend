module.exports = {
  cloud_storage: [
    'google_drive_username',
    'google_drive_password',
    'onedrive_username',
    'onedrive_password',
    'icloud_username',
    'icloud_password',
    'dropbox_username',
    'dropbox_password',
    'cloud_storage_username_1',
    'cloud_storage_password_1',
    'cloud_storage_username_2',
    'cloud_storage_password_2',
    'country',
  ],
  social_media: [
    'facebook_username',
    'facebook_password',
    'instagram_username',
    'instagram_password',
    'linkedin_username',
    'linkedin_password',
    'x_username',
    'x_password',
  ],

  bank: [
    'account_number',
    'account_holder',
    'ifsc_code',
    'branch',
    'phone_number',
    'bank_name',
    'country',
    'currency',
    'document_path',
  ],

  credit_card: [
    'card_number',
    'card_holder_name',
    'bank_name',
    'expiry_date',
    'country',
    'branch',
    'available_balance',
    'upload_credit_card',
  ],

  email_account: [
    'email_1_username',
    'email_1_password',
    'email_2_username',
    'email_2_password',
    'email_3_username',
    'email_3_password',
    'email_4_username',
    'email_4_password',
  ],

  crypto: [
    'wallet_address',
    'private_key',
    'seed_phrase',
    'password',
  ],

  'gold-details': [
    'locker_details',
    'service_provider',
    'location',
    'document_path',
  ],

  'business-ownership': [
    'business_name',
    'tax_id',
    'owner_name',
    'contact_number',
    'email',
  ],

  'fixed-deposit': [
    // Encrypt actual columns present in fixed_deposits model
    'fd_number',
    'institution_details',
    'nominee_information',
  ],

  insurance: [
    'policy_number',
    'premium_amount',
    'beneficiary_name',
    'agent_name',
  ],

  'legal-advisor': [
    'advisor_name',
    'contact_number',
    'email',
    'address',
    'specialization',
  ],

  lic: [
    'policy_number',
    'premium_amount',
    'maturity_amount',
    'beneficiary_name',
    'agent_name',
  ],

  'loan-details': [
    'loan_number',
    'owner_name',
    'phone_number',
  ],

  'medical-policy': [
    'policy_number',
    'premium_amount',
    'coverage_amount',
    'beneficiary_name',
    'provider_name',
  ],

  'mutual-fund': [
    'folio_number',
    'investment_amount',
    'nav',
    'units',
    'fund_name',
  ],

  'power-attorney': [
    'attorney_name',
    'contact_number',
    'address',
    'validity_period',
    'powers_granted',
  ],

  'real-estate': [
    'ownership_details',
    'insurance_details',
    'mortgage_details',
  ],

  stocks: [
    'stock_symbol',
    'quantity',
    'purchase_price',
    'current_price',
    'broker_name',
  ],

  'tax-details': [
    'pan_number',
    'aadhar_number',
    'tax_id',
    'filing_status',
    'assessing_officer',
  ],

  'term-insurance': [
    'policy_number',
    'premium_amount',
    'sum_assured',
    'beneficiary_name',
    'agent_name',
  ],

  transactions: [
    'transaction_id',
    'amount',
    'description',
    'reference_number',
    'account_details',
  ],

  trust: [
    'trust_name',
    'trustee_name',
    'beneficiary_name',
    'trust_value',
    'trust_deed_number',
  ],

  vehicle: [
    'ownership_details',
    'insurance_details',
    'lease_details',
  ],

  'will-testament': [
    'executor',
    'beneficiaries',
    'assets_distribution',
    'safe_storage',
  ],

  'document-sharing': [
    'document_name',
    'document_path',
    'access_token',
  ],

  'streaming-services': [
    'netflix_username',
    'netflix_password',
    'amazon_prime_username',
    'amazon_prime_password',
    'streaming_provider_username',
    'streaming_provider_password',
    'streaming_provider_2_username',
    'streaming_provider_2_password',
    'streaming_provider_3_username',
    'streaming_provider_3_password',
    'country',
  ],
};
