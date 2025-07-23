// src/routes/uploads.ts
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// save the image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file has been uploaded' });
  }
  
  res.json({ 
    success: 1,
    file: {
      url: `/uploads/${req.file.filename}`
    }
  });
});

export default router;