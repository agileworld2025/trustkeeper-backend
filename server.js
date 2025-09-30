/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const cors = require('cors');
const { PORT } = require('./config');
const defaultRoutes = require('./routes/index');
const { CUSTOMER_IGNORE_PATH, AUDIENCE_TYPE, ISSUER } = require('./utils/constant');
const Authentication = require('./utils/middlewares/auth');

const app = express();

app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, 'utils/uploads');

app.use('/api/uploads', express.static(UPLOADS_DIR));

app.use(cors());
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
