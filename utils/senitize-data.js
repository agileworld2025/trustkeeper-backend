/* eslint-disable no-console */
// utils/encryptData.js
const axios = require('axios');

const encryptData = async (data) => {
  try {
    const response = await axios.post('https://data-encryption-agileworld.azurewebsites.net/api/encrypt', {
      data: JSON.stringify(data),
      dataType: 'CARDS',
      isExpirable: false,
    }, {
      headers: {
        'Content-Type': 'application/json',
        CLIENT_ID: 'trustkeeperbe',
        CLIENT_SECRET: 'akdkas123219jbdf#dkadakafj',
      },
    });

    if (response && response.data) {
      const encryptDoc = response.data;

      return { doc: { encryptDoc } };
    }

    return { errors: [ { name: 'encryption', message: 'Encryption failed' } ] };
  } catch (error) {
    console.error('Encryption error:', error.message);

    return { errors: [ { name: 'encryption', message: error.message } ] };
  }
};

const decryptData = async (encryptedId) => {
  try {
    const response = await axios.get(`https://data-encryption-agileworld.azurewebsites.net/api/encrypt/${encryptedId}`, {
      headers: {
        'Content-Type': 'application/json',
        CLIENT_ID: 'trustkeeperbe',
        CLIENT_SECRET: 'akdkas123219jbdf#dkadakafj',
      },
    });

    if (response && response.data) {
      return { data: response.data };
    }

    return { errors: [ { name: 'decryption', message: 'Decryption failed' } ] };
  } catch (error) {
    console.error('Decryption error:', error.message);

    return { errors: [ { name: 'decryption', message: error.message } ] };
  }
};

module.exports = { encryptData, decryptData };
