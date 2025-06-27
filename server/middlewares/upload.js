import multer from "multer";

// Use memory storage for in-memory file uploads
const storage = multer.memoryStorage();

// Only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
