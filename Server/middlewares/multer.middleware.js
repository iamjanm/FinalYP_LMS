import multer from "multer";
import path from "path";
import fs from "fs";

// ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // keep original name (or you can prefix with timestamp to avoid collisions)
    cb(null, file.originalname);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".webp", ".png", ".mp4"];
  if (!allowed.includes(ext)) {
    cb(new Error(`Unsupported file type: ${ext}`), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

export default upload;
