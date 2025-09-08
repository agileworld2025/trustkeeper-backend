/* eslint-disable max-lines */
const moment = require('moment');
const { v1: uuidV1 } = require('uuid');
const twoFactor = require('node-2fa');
const {
  user: UserModel, otp: OTPModel, sequelize, user_relation: UserRelationModel,
} = require('../database');
const Helper = require('../utils/helper');
const OtpService = require('../utils/otp');
const {
  USER_TYPE, USER_STATUS, OTP_TYPE,
} = require('../utils/constant');
const { camelToSnake } = require('../utils/helper');
const authentication = require('./authentication');
const ErrorCode = require('../utils/error');

const register = async (payload) => {
  const {
    name, email, password, confirmPassword,
  } = payload;

  // Validate password confirmation
  if (password !== confirmPassword) {
    return {
      errors: [ {
        name: 'confirmPassword',
        message: 'Password and confirm password do not match',
        messages: {
          en: 'Password and confirm password do not match',
          sw: 'Nenosiri na kuthibitisha nenosiri hazifanani',
        },
      } ],
    };
  }

  // Validate password strength
  if (password.length < 8) {
    return {
      errors: [ {
        name: 'password',
        message: 'Password must be at least 8 characters long',
        messages: {
          en: 'Password must be at least 8 characters long',
          sw: 'Nenosiri lazima liwe na angalau herufi 8',
        },
      } ],
    };
  }

  const transaction = await sequelize.transaction();

  try {
    const response = await UserModel.findOne({
      where: { email },
      attributes: [ 'status', 'created_at' ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const { otp: __otp, validity: __validity, currentDate } = Helper.generateOTP();
    let otp = __otp;
    let validity = __validity;
    const publicId = uuidV1();

    const type = OTP_TYPE.USER_REGISTRAION;

    const otpResponse = await OTPModel.findOne({
      attributes: [ 'id', 'otp', 'created_at', 'validity' ],
      order: [ [ 'created_at', 'desc' ] ],
      where: { email },
      transaction,
    });

    if (otpResponse) {
      const {
        dataValues: { created_at: createdAt, otp: _otp, validity: _validity },
      } = otpResponse;

      if (moment().utc().diff(moment(createdAt), 'seconds') < 30) {
        await transaction.rollback();

        return {
          errors: [ {
            name: 'email',
            messages: {
              en: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP!',
              sw: 'Kikomo cha ombi la OTP kilipitwa. Tafadhali subiri kwa sekunde 30 kabla ya kuomba OTP nyingine!',
            },
            message: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP',
          } ],
        };
      }

      if (moment().utc().diff(moment(createdAt), 'seconds') < 600 && _validity > Date.now()) {
        otp = _otp;
        validity = _validity;
      }
    }

    const doc = camelToSnake({
      type, email, otp, validity, publicId,
    });

    if (response) {
      const { dataValues: { status, created_at: createdAt } } = response;

      if (status.toLowerCase() !== USER_STATUS.ACTIVE.toLowerCase()) {
        return { errors: [ { name: 'user', message: 'user is not in active state.' } ] };
      }

      if (moment().utc().diff(moment(createdAt), 'seconds') < 30) {
        await transaction.rollback();

        return {
          errors: [ {
            name: 'email',
            message: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP',
            messages: {
              en: 'The OTP request limit was exceeded. Please wait for 30 seconds before requesting another OTP!',
              sw: 'Kikomo cha ombi la OTP kilipitwa. Tafadhali subiri kwa sekunde 30 kabla ya kuomba OTP nyingine!',
            },
          } ],
        };
      }

      // Hash the password
      const salt = authentication.makeSalt();
      const hashedPassword = authentication.encryptPassword(password, salt);

      await OTPModel.create(doc, { transaction });
      await UserModel.update({
        concurrency_stamp: uuidV1(),
        name,
        salt,
        hashed_password: hashedPassword,
        system_generated_password: false,
      }, { where: { email }, transaction });

      const mailResponse = await OtpService.send({
        email, type, otp, validity, currentDate, referenceId: publicId, mailType: 'otp',
      });

      if (!mailResponse || !mailResponse.doc || mailResponse.error) {
        await transaction.rollback();

        return { errors: [ { name: 'mail_service', message: (mailResponse && mailResponse.message) || 'mail service is down' } ] };
      }

      await transaction.commit();

      return { doc: { message: 'Verification code sent to mail id.' } };
    }

    // Hash the password
    const salt = authentication.makeSalt();
    const hashedPassword = authentication.encryptPassword(password, salt);

    await OTPModel.create(doc, { transaction });
    await UserModel.create({
      user_type: USER_TYPE.CUSTOMER,
      public_id: uuidV1(),
      concurrency_stamp: uuidV1(),
      email,
      name,
      salt,
      hashed_password: hashedPassword,
      system_generated_password: false,
    }, { transaction });

    const mailResponse = await OtpService.send({
      email, type, otp, validity, currentDate, referenceId: publicId, mailType: 'otp',
    });

    if (!mailResponse || !mailResponse.doc || mailResponse.error) {
      await transaction.rollback();

      return { errors: [ { name: 'mail_service', message: (mailResponse && mailResponse.message) || 'mail service is down' } ] };
    }
    await transaction.commit();

    return { doc: { message: 'Verification code sent to mail id.' } };
  } catch (error) {
    await transaction.rollback();

    return { err: error.message };
  }
};

// const registerRelative = async (payload) => {
//   const {
//     email, relationType, customerUserId, name = '', mobileNumber = '', country = '', state = '', pincode = '', addressLine1 = '', addressLine2 = '',
//   } = payload;

//   const transaction = await sequelize.transaction();

//   try {
//     const response = await UserModel.findOne({
//       where: { email },
//       transaction,
//       lock: transaction.LOCK.UPDATE,
//     });

//     if (response) {
//       const { dataValues: { user_relation_id: userRealtionId } } = response;

//       if (userRealtionId) {
//         return { errors: [ { name: 'user', message: 'This user is already in relation with user.' } ] };
//       }
//     }

//     const userPublicId = uuidV1();

//     const relativePublicId = uuidV1();

//     await UserModel.create({
//       user_type: USER_TYPE.RELATIVE,
//       public_id: userPublicId,
//       concurrency_stamp: uuidV1(),
//       email,
//       user_relation_id: relativePublicId,
//     }, { transaction });

//     await UserRelationModel.create({
//       public_id: relativePublicId,
//       user_id: userPublicId,
//       relative_of: customerUserId,
//       relation_type: relationType,
//       name,
//       mobile_number: mobileNumber,
//       country,
//       state,
//       pincode,
//       address_line_1: addressLine1,
//       address_line_2: addressLine2,
//     }, { transaction });

//     await transaction.commit();

//     return { doc: { message: 'Relative registered successfully' } };
//   } catch (error) {
//     await transaction.rollback();

//     return { err: error.message };
//   }
// };

const registerRelative = async (payload) => {
  const {
    email,
    relationType,
    customerUserId,
    name = '',
    mobileNumber = '',
    country = '',
    state = '',
    pincode = '',
    addressLine1 = '',
    addressLine2 = '',
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    const existingUser = await UserModel.findOne({
      where: { email },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingUser) {
      const { dataValues: { user_relation_id: userRelationId } } = existingUser;

      if (userRelationId) {
        // Check if the relation is already linked to this customer
        const existingRelation = await UserRelationModel.findOne({
          where: {
            public_id: userRelationId,
            relative_of: customerUserId,
          },
          transaction,
        });

        if (existingRelation) {
          await transaction.commit();

          return {
            doc: {
              message: 'Relative is already registered.',
              // public_id,
            },
          };
        }

        return {
          errors: [
            {
              name: 'user',
              message: 'This email is already associated with a relative of another user.',
            },
          ],
        };
      }
    }

    // If user does not exist or has no relation, proceed with registration
    const userPublicId = uuidV1();
    const relativePublicId = uuidV1();

    if (!existingUser) {
      await UserModel.create({
        user_type: USER_TYPE.RELATIVE,
        public_id: userPublicId,
        concurrency_stamp: uuidV1(),
        email,
        user_relation_id: relativePublicId,
      }, { transaction });
    } else {
      await existingUser.update(
        {
          user_type: USER_TYPE.RELATIVE,
          user_relation_id: relativePublicId,
        },
        { transaction },
      );
    }

    await UserRelationModel.create({
      public_id: relativePublicId,
      user_id: existingUser ? existingUser.public_id : userPublicId,
      relative_of: customerUserId,
      relation_type: relationType,
      name,
      mobile_number: mobileNumber,
      country,
      state,
      pincode,
      address_line_1: addressLine1,
      address_line_2: addressLine2,
    }, { transaction });

    await transaction.commit();

    return {
      doc: {
        message: 'Relative registered successfully',
        public_id: existingUser ? existingUser.public_id : userPublicId,
      },
    };
  } catch (error) {
    await transaction.rollback();

    return {
      errors: [
        {
          name: 'registerRelative',
          message: error.message,
        },
      ],
    };
  }
};

const patchRelative = async (payload) => {
  const {
    publicId, updatedBy, email, ...newDoc
  } = payload;

  const transaction = await sequelize.transaction();

  try {
    const response = await UserRelationModel.findOne({
      where: { public_id: publicId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!response) {
      await transaction.rollback();

      return { errors: [ { name: 'Bank', message: 'No record found.' } ] };
    }

    const doc = Helper.convertCamelToSnake({ ...newDoc });

    await UserRelationModel.update(doc, { where: { public_id: publicId }, transaction });

    if (email) {
      await UserModel.update({ email }, { where: { user_relation_id: publicId }, transaction });
    }

    await transaction.commit();

    return { doc: { message: 'Successfully updated.', publicId } };
  } catch (error) {
    await transaction.rollback();

    return { errors: [ { name: 'patch', message: 'An error occurred while updating the bank data.' } ] };
  }
};

const getRelatives = async (customerUserId) => {
  try {
    // Fetch all relationships for the given customer
    const relationships = await UserRelationModel.findAll({
      where: { relative_of: customerUserId },
      order: [ [ 'createdAt', 'DESC' ] ],
    });

    if (!relationships || relationships.length === 0) {
      return { doc: { message: 'No relatives found for this customer.' } };
    }

    // Extract user IDs from the relationships
    const userIds = relationships.map((rel) => rel.user_id);

    // Fetch user details in a separate query
    const users = await UserModel.findAll({
      where: { public_id: userIds },
      attributes: [ 'public_id', 'email', 'user_type', 'name', 'user_name' ],
    });

    // Map user details to their corresponding relationships
    const userMap = users.reduce((acc, user) => {
      acc[user.public_id] = user;

      return acc;
    }, {});

    // Combine relationship data with user details
    const formattedRelatives = relationships.map((rel) => ({
      relativeId: rel.public_id,
      relationType: rel.relation_type,
      name: rel.name || null,
      mobileNumber: rel.mobile_number || null,
      country: rel.country || null,
      state: rel.state || null,
      pincode: rel.pincode || null,
      addressLine1: rel.address_line_1 || null,
      addressLine2: rel.address_line_1 || null,
      userDetails: userMap[rel.user_id] || null,
      createdAt: rel.createdAt,
    }));

    return { doc: { relatives: formattedRelatives } };
  } catch (error) {
    return { err: error.message };
  }
};

const verification = async (payload) => {
  const { email, otp } = payload;

  try {
    const res = await UserModel.findOne({
      where: { email },
      attributes: [ 'mobile_number', 'user_type', 'email', [ 'public_id', 'user_id' ] ],
    });

    if (res) {
      const dataValues = Helper.convertSnakeToCamel(res.dataValues);
      const { userId } = dataValues;

      const response = await OTPModel.findOne({
        where: { email, type: OTP_TYPE.USER_REGISTRAION },
        attributes: [ 'id', 'otp', 'validity' ],
        order: [ [ 'id', 'desc' ] ],
      });

      if (response) {
        const { otp: otpResponse, validity, id } = response;

        if (otpResponse !== otp) {
          return {
            errors: [ {
              message: 'Please enter the correct OTP, or use Resend OTP! ',
              messages: {
                en: 'Please enter the correct OTP, or use Resend OTP! ',
                sw: 'Tafadhali ingiza OTP sahihi, au tumia Tuma Upya OTP!',
              },
              name: 'otp',
            } ],
          };
        }

        if (moment().utc().diff(moment(validity), 'seconds') >= 0) {
          return {
            errors: [ {
              message: 'OTP has been expired.',
              messages: {
                en: 'The OTP has expired.',
                sw: 'Muda wa OTP umekwisha.',
              },
              name: 'otp',
            } ],
          };
        }

        await OTPModel.update({ validity: Date.now() }, { where: { id } });
        await UserModel.update(
          { is_email_verified: true },
          {
            where: { public_id: userId },
          },
        );

        return {
          doc: { isEmailVerified: true },
        };
      }

      return {
        errors: [ {
          name: 'email',
          message: 'Please enter the correct OTP!',
          messages: {
            en: 'Please enter the correct OTP!',
            sw: 'Tafadhali weka OTP sahihi!',
          },
        } ],
      };
    }

    return { errors: [ { name: 'email', message: 'email is not registered' } ] };
  } catch (error) {
    return { err: error.message };
  }
};

const setPassword = async (payload) => {
  const { email, password, name } = payload;

  try {
    const where = { email };

    const response = await UserModel.findOne({
      where,
      attributes: [ [ 'public_id', 'user_id' ], 'user_relation_id', 'user_type' ],
    });

    if (response) {
      const doc = Helper.convertSnakeToCamel(response.dataValues);

      const { userId, userRelationId, userType } = doc;

      const salt = authentication.makeSalt();

      const hashedPassword = authentication.encryptPassword(password, salt);

      await UserModel.update({
        salt,
        hashed_password: hashedPassword,
        system_generated_password: false,
        name,
        last_login_at: new Date(),
      }, { where: { public_id: userId } });

      if (userRelationId) {
        const userResponse = await UserRelationModel.findOne({
          where: { public_id: userRelationId },
        });

        if (userResponse) {
          const { relative_of: customerUserId } = userResponse;
          const { accessToken, refreshToken } = authentication.generateToken({
            userId, email, customerUserId, userType,
          });

          return {
            doc: {
              message: 'Password set successfully!',
              accessToken,
              refreshToken,
            },
          };
        }
      }

      const { accessToken, refreshToken } = authentication.generateToken({ userId, email, userType });

      return {
        doc: {
          message: 'Password set successfully!',
          accessToken,
          refreshToken,
        },
      };
    }

    return {
      errors: [ { name: 'userName', message: 'user is not registered' } ],
    };
  } catch (error) {
    return { err: error.message };
  }
};

const login = async (payload) => {
  const { email, password, totp } = payload;
  const transaction = await sequelize.transaction();

  try {
    const response = await UserModel.findOne({
      where: {
        email,
        is_email_verified: true,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
      attributes: [
        'hashed_password', 'salt', 'email', [ 'public_id', 'user_id' ], 'user_type', 'name',
        'is_email_verified', 'is_mobile_verified', 'mobile_number', 'system_generated_password', 'user_relation_id',
        'status', 'is_mfa_enabled', 'mfa_secret',
      ],
    });

    if (response) {
      const doc = Helper.convertSnakeToCamel(response.dataValues);
      const {
        userId, status, hashedPassword, salt, systemGeneratedPassword, isMfaEnabled, mfaSecret, userRelationId, userType, name,
      } = doc;

      if (status === USER_STATUS.ACTIVE) {
        const isValidPassword = authentication.verifyPassword(hashedPassword, password, salt);

        if (isValidPassword) {
          if (systemGeneratedPassword) {
            await transaction.rollback();

            return {
              errors: {
                errorCode: ErrorCode['100'],
                details: [ { name: 'isSystemGeneratedPassword', message: 'Invalid password! This password is system-generated.' } ],
              },
            };
          }

          if (isMfaEnabled) {
            if (!totp) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['101'],
                  details: [ { name: 'isMfaEnabled', message: 'Missing TOTP parameter!' } ],
                },
              };
            }

            const verified = twoFactor.verifyToken(mfaSecret, totp);
            const { delta } = verified || { delta: -2 };

            if (delta === -2) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['400'],
                  details: [ { name: 'isMfaEnabled', message: 'Invalid MFA code.' } ],
                },
              };
            }

            if (delta < 0) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['400'],
                  details: [ { name: 'isMfaEnabled', message: 'MFA code is too late.' } ],
                },
              };
            }

            if (delta > 0) {
              await transaction.rollback();

              return {
                errors: {
                  errorCode: ErrorCode['400'],
                  details: [ { name: 'isMfaEnabled', message: 'MFA code is too early.' } ],
                },
              };
            }
          }

          await UserModel.update({ last_login_at: new Date() }, { where: { public_id: userId }, transaction });

          if (userType === USER_TYPE.RELATIVE) {
            const userResponse = await UserRelationModel.findOne({
              where: { user_id: userId, public_id: userRelationId },
            });

            if (userResponse) {
              const { relative_of: customerUserId } = userResponse;
              const { accessToken, refreshToken } = authentication.generateToken({
                userId, email, customerUserId, userType, name,
              });

              await transaction.commit();

              return { doc: { accessToken, refreshToken } };
            }
          }

          const { accessToken, refreshToken } = await authentication.generateToken({
            userId, email, userType, name,
          });

          await transaction.commit();

          return { doc: { accessToken, refreshToken } };
        }

        await transaction.rollback();

        return {
          errors: {
            details: [ { name: 'password', message: 'Invalid password.' } ],
          },
        };
      }

      await transaction.rollback();

      return {
        errors: {
          errorCode: ErrorCode['400'],
          details: [ { name: 'userName', message: 'User is not active.' } ],
        },
      };
    }

    await transaction.rollback();

    return {
      errors: {
        errorCode: ErrorCode['400'],
        details: [ { name: 'userName', message: 'User is not registered.' } ],
      },
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const createMFA = async (payload) => {
  const { userId } = payload;

  const response = await UserModel.findOne({
    where: { public_id: userId },
    attributes: [ [ 'public_id', 'user_id' ], 'user_type',
      [ 'is_mfa_enabled', 'isMfaEnabled' ], 'mfa_secret' ],
  });

  if (response) {
    const { dataValues: { isMfaEnabled } } = response;

    if (!isMfaEnabled) {
      const { secret, uri, qr } = twoFactor.generateSecret({ name: 'agile', account: 'agile' });

      return { doc: { uri, qr, secret } };
    }

    return { errors: [ { name: '2FA', message: '2fa is already enabled for the account!' } ] };
  }

  return { errors: [ { name: 'User', message: 'User does not exist!' } ] };
};

const verifyMFA = async (payload) => {
  const { otp, secret, userId } = payload;
  const transaction = await sequelize.transaction();

  try {
    const response = await UserModel.findOne({
      where: { public_id: userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (response) {
      const verified = twoFactor.verifyToken(secret, otp);

      if (verified) {
        const { delta } = verified;

        if (delta === 0) {
          await UserModel.update(
            { is_mfa_enabled: true, mfa_secret: secret },
            { where: { public_id: userId }, transaction },
          );

          await transaction.commit();

          return { doc: { isVerified: true } };
        }

        await transaction.rollback();
        if (delta < 0) {
          return {
            errors: [ { name: 'Otp', message: 'MFA code is too old.' } ],
          };
        } if (delta > 0) {
          return {
            errors: [ { name: 'Otp', message: 'MFA code is too early.' } ],
          };
        }
      }

      await transaction.rollback();

      return { errors: [ { name: 'Otp', message: 'Otp is not correct!' } ] };
    }

    await transaction.rollback();

    return { errors: [ { name: 'User', message: 'User does not exist!' } ] };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const forgotPassword = async (payload) => {
  const { email } = payload;

  // Validate email is provided
  if (!email) {
    return {
      errors: [ {
        name: 'email',
        message: 'Email is required',
      } ],
    };
  }

  const transaction = await sequelize.transaction();

  try {
    const response = await UserModel.findOne({
      where: { email, user_type: USER_TYPE.CUSTOMER },
      transaction,
      lock: transaction.LOCK.UPDATE,
      attributes: [ 'email', 'status', [ 'public_id', 'user_id' ] ],
    });

    if (response) {
      const dataValues = Helper.convertSnakeToCamel(response.dataValues);
      const { userId, status } = dataValues;

      if (status.toLowerCase() !== USER_STATUS.ACTIVE.toLowerCase()) {
        await transaction.rollback();

        return { errors: [ { name: 'user', message: 'user is not in active state.' } ] };
      }

      const salt = authentication.makeSalt();
      const password = Helper.generatePassword();
      const hashedPassword = authentication.encryptPassword(password, salt);

      // Only update the necessary fields for password reset
      const updateDoc = {
        salt,
        hashed_password: hashedPassword,
        system_generated_password: false,
        concurrency_stamp: uuidV1(),
      };

      await UserModel.update(updateDoc, { where: { public_id: userId }, transaction });

      const mailResponse = await OtpService.send({ email, password, mailType: 'password' });

      if (mailResponse && mailResponse.doc && !mailResponse.error) {
        await transaction.commit();

        return { doc: { message: 'Password reset email sent successfully.' } };
      }

      await transaction.rollback();

      return { errors: [ { name: 'mail_service', message: (mailResponse && mailResponse.message) || 'mail service is down' } ] };
    }

    await transaction.rollback();

    return {
      errors: [ {
        name: 'email',
        message: 'Email not found or user is not registered',
      } ],
    };
  } catch (error) {
    await transaction.rollback();
    // eslint-disable-next-line no-console
    console.error('Forgot password error:', error);
    throw error;
  }
};

const getUserDetails = async (payload) => {
  const { userId } = payload;

  const response = await UserModel.findOne({
    where: { public_id: userId },
  });

  if (response) {
    const doc = Helper.convertSnakeToCamel(response.dataValues);

    return { doc };
  }

  return { errors: [ { name: 'userName', message: 'user is not registered' } ] };
};

module.exports = {
  register,
  verification,
  login,
  setPassword,
  createMFA,
  verifyMFA,
  forgotPassword,
  registerRelative,
  getRelatives,
  patchRelative,
  getUserDetails,
};
