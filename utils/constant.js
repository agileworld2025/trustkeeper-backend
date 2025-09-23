module.exports = {
  USER_STATUS: {
    BLOCKED: 'BLOCKED',
    DELETED: 'DELETED',
    IN_ACTIVE: 'IN_ACTIVE',
    ACTIVE: 'ACTIVE',
  },

  OTP_TYPE: {
    USER_REGISTRAION: 'USER_REGISTRAION',
    E_SIGNED_REQUESTED: 'E_SIGNED_REQUESTED',
    USER_EMAIL_REQUEST: 'USER_EMAIL_REQUEST',
    PASSWORD_RESET: 'PASSWORD_RESET',
  },

  LOGIN_TYPE: {
    MOBILE_NUMBER_OTP: 'MOBILE_NUMBER_OTP',
    GOOGLE: 'GOOGLE',
    APPLE: 'APPLE',
    USER_NAME_PASSWORD: 'USER_NAME_PASSWORD',
    CLIENT_ID_SECRET: 'CLIENT_ID_SECRET',
  },

  USER_TYPE: {
    PLATFORM: 'PLATFORM',
    CUSTOMER: 'CUSTOMER',
    RELATIVE: 'RELATIVE',
  },

  CUSTOMER_IGNORE_PATH: [ '/api/register', '/api/verification', '/api/set-password', '/api/login', '/api/forget-password', '/api/reset-password', '/api/uploads', '/api/document-sharing/view' ],

  AUDIENCE_TYPE: {
    PLATFORM: 'PLATFORM',
    CUSTOMER: 'CUSTOMER',
  },

  ROLE_TYPE: {
    RELATIVE: 'RELATIVE',
    MAIN: 'MAIN',
  },

  ISSUER: 'AGILE WORLD TECHNOLOGIES',
};
