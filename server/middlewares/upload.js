import multer from "multer";


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
