const crypto = require('crypto');

/**
 * Encryption configuration
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Get encryption key from environment variable
 * @returns {string} Encryption key
 */
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }

  return key;
}

/**
 * Derive key from password using PBKDF2
 * @param {string} password - The password to derive key from
 * @param {Buffer} salt - The salt to use
 * @returns {Buffer} Derived key
 */
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
}

/**
 * Check if a value is already encrypted
 * @param {string} value - The value to check
 * @returns {boolean} True if encrypted, false otherwise
 */
function isEncrypted(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Check if it's base64 encoded and long enough to be encrypted
  const base64Regex = /^[A-Za-z0-9+/=]+$/;

  return base64Regex.test(value) && value.length > 50;
}

/**
 * Encrypt a string using AES-256-GCM
 * @param {string} text - The text to encrypt
 * @returns {string} Encrypted string (base64 encoded)
 */
function encrypt(text) {
  if (!text || text === '') {
    return text;
  }

  try {
    // Convert to string if it's a number
    const textToEncrypt = typeof text === 'number' ? text.toString() : text;
    const password = getEncryptionKey();
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(password, salt);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    cipher.setAAD(salt);

    let encrypted = cipher.update(textToEncrypt, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Combine salt + iv + tag + encrypted
    const combined = Buffer.concat([ salt, iv, tag, Buffer.from(encrypted, 'hex') ]);

    return combined.toString('base64');
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt a string using AES-256-GCM
 * @param {string} encryptedData - The encrypted string (base64 encoded)
 * @returns {string} Decrypted string
 */
function decrypt(encryptedData) {
  if (!encryptedData || encryptedData === '') {
    return encryptedData;
  }

  try {
    // Check if the data looks like it's encrypted
    if (!isEncrypted(encryptedData)) {
      return encryptedData;
    }

    const password = getEncryptionKey();
    const combined = Buffer.from(encryptedData, 'base64');

    // Check if we have enough data for all components
    if (combined.length < ENCRYPTED_POSITION) {
      return encryptedData;
    }

    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, TAG_POSITION);
    const tag = combined.subarray(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = combined.subarray(ENCRYPTED_POSITION);

    const key = deriveKey(password, salt);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAAD(salt);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, null, 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Return original data if decryption fails
    return encryptedData;
  }
}

/**
 * Encrypt an object's specified fields
 * @param {Object} obj - The object to encrypt
 * @param {Array} fieldsToEncrypt - Array of field names to encrypt
 * @returns {Object} Object with encrypted fields
 */
function encryptObject(obj, fieldsToEncrypt) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const encryptedObj = { ...obj };

  fieldsToEncrypt.forEach((field) => {
    if (encryptedObj[field] !== undefined && encryptedObj[field] !== null && encryptedObj[field] !== '') {
      encryptedObj[field] = encrypt(encryptedObj[field]);
    }
  });

  return encryptedObj;
}

/**
 * Decrypt an object's specified fields
 * @param {Object} obj - The object to decrypt
 * @param {Array} fieldsToDecrypt - Array of field names to decrypt
 * @returns {Object} Object with decrypted fields
 */
function decryptObject(obj, fieldsToDecrypt) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const decryptedObj = { ...obj };

  fieldsToDecrypt.forEach((field) => {
    if (decryptedObj[field] !== undefined && decryptedObj[field] !== null && decryptedObj[field] !== '') {
      try {
        decryptedObj[field] = decrypt(decryptedObj[field]);
      } catch (error) {
        // Keep original value if decryption fails
      }
    }
  });

  return decryptedObj;
}

/**
 * Encrypt an array of objects' specified fields
 * @param {Array} array - The array of objects to encrypt
 * @param {Array} fieldsToEncrypt - Array of field names to encrypt
 * @returns {Array} Array of objects with encrypted fields
 */
function encryptArray(array, fieldsToEncrypt) {
  if (!Array.isArray(array)) {
    return array;
  }

  return array.map((obj) => encryptObject(obj, fieldsToEncrypt));
}

/**
 * Decrypt an array of objects' specified fields
 * @param {Array} array - The array of objects to decrypt
 * @param {Array} fieldsToDecrypt - Array of field names to decrypt
 * @returns {Array} Array of objects with decrypted fields
 */
function decryptArray(array, fieldsToDecrypt) {
  if (!Array.isArray(array)) {
    return array;
  }

  return array.map((obj) => decryptObject(obj, fieldsToDecrypt));
}

module.exports = {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  encryptArray,
  decryptArray,
};
