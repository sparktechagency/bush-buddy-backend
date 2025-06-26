/* eslint-disable no-unused-vars */
import { Request } from "express";
import multer from "multer";

// Multer memory storage
const storage = multer.memoryStorage();

// File filter for image types
const fileFilter = (
  req: Request,
  file: { mimetype: string },
  cb: (error: null, _acceptFile: boolean) => void
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, fileFilter });
