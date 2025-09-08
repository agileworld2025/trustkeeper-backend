/* eslint-disable no-restricted-syntax */
const convertCamelCase = require('lodash.camelcase');
const generator = require('generate-password');
const moment = require('moment');

const convertCamelToSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

const convertCamelObjectToSnake = (payload) => {
  const obj = { ...payload };
  const response = {};
  const objectKeys = Object.keys(obj);

  objectKeys.map((key) => {
    const convertedKey = convertCamelToSnake(key); // Correct function

    response[convertedKey] = obj[key];

    return true;
  });

  return response;
};

function camelToSnake(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  // Handle Date objects
  if (obj instanceof Date) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item));
  }

  const result = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

      result[snakeKey] = camelToSnake(obj[key]);
    }
  }

  return result;
}
const convertSnakeObjectToCamel = (payload) => {
  const obj = {
    ...payload,
  };
  const response = {};
  const objectKeys = Object.keys(obj);

  objectKeys.map((key) => {
    const convertedKey = convertCamelCase(key);

    if (obj[key] && Object.prototype.toString.call(obj[key]) === '[object Object]' && !(obj[key] instanceof Date)) {
      const {
        dataValues,
      } = obj[key];

      let result;

      if (dataValues) {
        result = convertSnakeObjectToCamel(dataValues);
      } else {
        result = convertSnakeObjectToCamel(obj[key]);
      }

      response[convertedKey] = result;
    } else if (obj[key] && Object.prototype.toString.call(obj[key]) === '[object Array]' && !(obj[key] instanceof Date)) {
      const rows = [];

      obj[key].forEach((element) => {
        const {
          dataValues: dataValues2,
        } = element;

        let result;

        if (dataValues2) {
          if (Object.prototype.toString.call(dataValues2) === '[object Object]') {
            result = convertSnakeObjectToCamel(dataValues2);
          } else {
            result = dataValues2;
          }
        } else if (Object.prototype.toString.call(element) === '[object Object]') {
          result = convertSnakeObjectToCamel(element);
        } else {
          result = element;
        }
        rows.push(result);
      });

      response[convertedKey] = rows;
    } else {
      response[convertedKey] = obj[key];
    }

    return true;
  });

  return response;
};

// const convertCamelToSnake = (payload) => {
//   const payloadDataType = typeof payload;

//   switch (payloadDataType) {
//     case 'string':
//       return convertSnakeCase(payload);

//     case 'object':
//       return convertCamelObjectToSnake(payload);

//     default:
//       return payload;
//   }
// };

const convertSnakeToCamel = (payload) => {
  const payloadDataType = typeof payload;

  switch (payloadDataType) {
    case 'string':
      return convertCamelCase(payload);

    case 'object':
      return convertSnakeObjectToCamel(payload);

    default:
      return payload;
  }
};

const generateOTP = () => {
  const digits = '0123456789';

  let otp = '';

  [ 0, 1, 2, 3, 4, 6 ].forEach(() => {
    otp += digits[Math.floor(Math.random() * 10)];
  });

  const now = new Date();
  const validity = moment(now).add(15, 'minutes').toDate(); // Convert to JavaScript Date
  const validityInMinutes = 15;
  const currentDate = moment().utcOffset('+03:00').format('YYYY-MM-DD HH:mm:ss');

  return {
    otp,
    validity,
    validityInMinutes,
    currentDate,
  };
};

const generatePassword = () => {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  return password;
};

module.exports = {
  generatePassword,
  convertCamelToSnake,
  generateOTP,
  convertSnakeToCamel,
  camelToSnake,

};
