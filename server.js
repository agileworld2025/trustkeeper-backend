/* eslint-disable no-console */
// import authRoutes from './routes/auth.js';
// import templateRoutes from './routes/templates.js';
// import applySignatureRoutes from './routes/applySignature.js';

const express = require('express');
const path = require('path');
const cors = require('cors');
// const axios = require('axios');
// const { spawn } = require('child_process');
const { PORT } = require('./config');
const defaultRoutes = require('./routes/index');
const { CUSTOMER_IGNORE_PATH, AUDIENCE_TYPE, ISSUER } = require('./utils/constant');
const Authentication = require('./utils/middlewares/auth');

// const TENANT_ID = '84d6d9cf-526c-4ea9-b2d2-2f9beb62bfb5';
// const CLIENT_ID = '516050e8-4519-4c4b-8b27-737f45bddcca';
// const CLIENT_SECRET = '.e98Q~xmFgxbX8andbaf_OtlMuhT-HoV9cymFcsz';
// const SIGNATURE_HTML = '<b>Best Regards,</b><br>AgileWorldTechnologies';

const app = express();

app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, 'utils/uploads');

app.use('/api/uploads', express.static(UPLOADS_DIR));

app.use(cors());

// app.use(cors({
//   origin: [ 'https://web-app-trustkeeper-ebdfd8hzf3evbpfc.canadacentral-01.azurewebsites.net', 'https://digital-twin-ckbzawauhbaue2cm.canadacentral-01.azurewebsites.net', 'http://localhost:3000' ],
// }));

// const qs = require('qs'); // Add this at the top

// app.get('/auth/callback', async (req, res) => {
//   console.log('Auth Callback Triggered:', req.query);

//   const { code, admin_consent, error, error_description } = req.query;

//   if (error) {
//     console.error(`Error: ${error} - ${error_description}`);
//     return res.status(400).send(`Authorization failed: ${error_description}`);
//   }

//   if (admin_consent === 'True') {
//     return res.send('Admin consent granted. Please log in to proceed.');
//   }

//   if (!code) {
//     return res.status(400).send('No authorization code found.');
//   }

//   try {
//     const tokenResponse = await axios.post(
//       'https://login.microsoftonline.com/common/oauth2/v2.0/token',
//       qs.stringify({  // Properly encode as x-www-form-urlencoded
//         client_id: '516050e8-4519-4c4b-8b27-737f45bddcca',
//         client_secret: '.e98Q~xmFgxbX8andbaf_OtlMuhT-HoV9cymFcsz',
//         code,
//         redirect_uri: 'http://localhost:3002/auth/callback',
//         grant_type: 'authorization_code',
//       }),
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       }
//     );

//     const { access_token, refresh_token, expires_in } = tokenResponse.data;
//     res.json({ message: 'Login Successful!', access_token, refresh_token, expires_in });

//   } catch (error) {
//     console.error('Error exchanging authorization code:', error.response?.data || error.message);
//     res.status(500).send('Failed to exchange authorization code.');
//   }
// });

// async function getAccessToken() {
//   const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

//   const data = qs.stringify({
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       grant_type: "client_credentials",
//       scope: "https://graph.microsoft.com/.default",
//   });

//   try {
//       const response = await axios.post(tokenUrl, data, {
//           headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//           },
//       });
//       return response.data.access_token;
//   } catch (error) {
//       console.error("Error fetching access token:", error.response ? error.response.data : error.message);
//       throw error;
//   }
// }

// async function applySignature(userId, accessToken) {
//   const url = `https://graph.microsoft.com/v1.0/users/${userId}/mailboxSettings`;
//   try {
//       await axios.patch(url, { signatureText: SIGNATURE_HTML }, {
//           headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
//       });
//       return { userId, success: true };
//   } catch (error) {
//       return { userId, success: false, error: error.response ? error.response.data : error.message };
//   }
// }

// // Apply Email Signature Route
// app.post("/apply-signature", async (req, res) => {
//   try {
//       const accessToken = await getAccessToken();
//       const usersResponse = await axios.get("https://graph.microsoft.com/v1.0/users", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const results = await Promise.all(usersResponse.data.value.map(user => applySignature(user.id, accessToken)));
//       res.json({ message: "Signature application process completed", results });
//   } catch (error) {
//       res.status(500).json({ message: "Failed to apply signatures", error: error.response ? error.response.data : error.message });
//   }
// });

// Routes
// app.use('/auth', authRoutes);
// app.use('/templates', templateRoutes);
// app.use('/apply-signature', applySignatureRoutes);

app.use('/api', Authentication({
  AUDIENCE: AUDIENCE_TYPE.CUSTOMER,
  ignorePaths: CUSTOMER_IGNORE_PATH,
  ISSUER,
}), defaultRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

module.exports = { app };

let server;

try {
  server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Uploaded files can be accessed at http://localhost:${PORT}/uploads`);
  });
} catch (e) {
  console.error('Failed to start server:', e);
  if (server) server.close();
}
