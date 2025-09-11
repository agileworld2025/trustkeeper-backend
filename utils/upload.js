const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'));
};

// Single file upload (backward compatibility)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});

// Multiple files upload with dynamic field names (up to 5 images per field)
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 25, // Maximum 25 files total (5 fields × 5 images each)
  },
});

// Middleware to handle dynamic multiple file uploads
const uploadDynamicImages = (req, res, next) => {
  // Create a dynamic fields configuration
  const fields = [];

  // Extract field names from request body or query params
  const fieldNames = req.body.fieldNames || req.query.fieldNames || [ 'images' ];

  // If fieldNames is a string, convert to array
  const fieldArray = Array.isArray(fieldNames) ? fieldNames : fieldNames.split(',');

  // Create multer fields configuration for up to 5 images per field
  fieldArray.forEach((fieldName) => {
    fields.push({ name: fieldName, maxCount: 5 });
  });

  // Use multer.fields with dynamic configuration
  const uploadMiddleware = uploadMultiple.fields(fields);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File size too large. Maximum 5MB per file.',
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            status: 'error',
            message: 'Too many files. Maximum 5 images per field.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Unexpected field name for file upload.',
          });
        }
      }

      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }

    // Process uploaded files and organize them by field name
    if (req.files) {
      const processedFiles = {};

      Object.keys(req.files).forEach((fieldName) => {
        const files = req.files[fieldName];

        processedFiles[fieldName] = files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        }));
      });

      req.uploadedFiles = processedFiles;
    }

    next();
  });
};

// Middleware for specific field names (predefined)
const uploadImagesForFields = (fieldNames) => (req, res, next) => {
  const fields = fieldNames.map((fieldName) => ({ name: fieldName, maxCount: 5 }));
  const uploadMiddleware = uploadMultiple.fields(fields);

  uploadMiddleware(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File size too large. Maximum 5MB per file.',
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            status: 'error',
            message: 'Too many files. Maximum 5 images per field.',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Unexpected field name for file upload.',
          });
        }
      }

      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }

    // Process uploaded files and organize them by field name
    if (req.files) {
      const processedFiles = {};

      Object.keys(req.files).forEach((fieldName) => {
        const files = req.files[fieldName];

        processedFiles[fieldName] = files.map((file) => ({
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
        }));
      });

      req.uploadedFiles = processedFiles;
    }

    next();
  });
};

module.exports = {
  upload,
  uploadMultiple,
  uploadDynamicImages,
  uploadImagesForFields,
};
