const register = require('./register');
const verification = require('./verification');
const setPassword = require('./set-password');
const login = require('./login');
const forgotPassword = require('./forgot-password');
const registerRelative = require('./registration-relative');
const patchRelative = require('./patchRelative');

module.exports = {
  register, verification, setPassword, login, forgotPassword, registerRelative, patchRelative,
};
