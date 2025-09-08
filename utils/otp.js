/* eslint-disable no-console */
const nodemailer = require('nodemailer');

const getOtpText = ({ email, otp, validity }) => `
Your OTP is below:
Email: ${email}
OTP: ${otp}
Validity: ${validity} minutes

Regards,
`;

const getPasswordText = ({ email, password }) => `
Your password reset request was successful.
Email: ${email}
Temporary Password: ${password}

Please log in and update your password as soon as possible.

Regards,
`;

const send = async (payload) => {
  const {
    email, otp, validity, mailType, password,
  } = payload;

  const transporter = await nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'agileworldtechnologies007@gmail.com',
      pass: 'ofzv mikr szfv dgkn',
    },
  });

  let emailText;

  if (mailType === 'otp') {
    emailText = getOtpText({ email, otp, validity });
  } else if (mailType === 'password') {
    emailText = getPasswordText({ email, password });
  } else {
    throw new Error('Invalid mailType specified.');
  }

  const mailOptions = {
    from: 'agileworldtechnologies007@gmail.com',
    to: email,
    subject: mailType === 'otp' ? 'OTP Verification' : 'Password Reset',
    text: emailText,
  };

  try {
    const mailResponse = await transporter.sendMail(mailOptions);
    const { messageId } = mailResponse;

    console.log('Message sent: %s', messageId);

    return { doc: { message: 'Successfully sent the email' } };
  } catch (error) {
    console.error('Error sending email:', error);

    // Return error response instead of throwing
    return {
      error: true,
      message: error.message,
      doc: null,
    };
  }
};

module.exports = { send };
