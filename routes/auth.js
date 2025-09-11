const {
  register, verification, setPassword, login, createMFA, verifyMFA, forgotPassword, resetPasswordWithOtp, registerRelative, getRelatives, patchRelative,
  getUserDetails,
} = require('../controllers/auth');

module.exports = (router) => {
  router.post('/register', register);
  router.post('/relative', registerRelative);
  router.post('/verification', verification);
  router.post('/set-password', setPassword);
  router.post('/login', login);
  router.get('/mfa/create', createMFA);
  router.post('/mfa/verify', verifyMFA);
  router.post('/forget-password', forgotPassword);
  router.post('/reset-password', resetPasswordWithOtp);
  router.get('/relatives', getRelatives);
  router.patch('/relatives/:publicId', patchRelative);
  router.get('/profile', getUserDetails);
};
