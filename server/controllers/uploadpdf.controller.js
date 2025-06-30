import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import {Note} from "../models/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import pdfParse from "pdf-parse";
export const uploadPdfNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No PDF file uploaded");
  }

  const pdfBuffer = req.file.buffer; // ✅ use buffer directly
  const pdfData = await pdfParse(pdfBuffer);
  const { subject, tags = [] } = req.body;
  const note = await Note.create({
    title: req.file.originalname,
    content: pdfData.text,
    subject,
    tags,
    user: req.user._id,
    isPdf: true,
    pdfPath: "in-memory", // Or leave null if not storing
  });

  res.status(201).json(new ApiResponse(201, note, "PDF note uploaded"));
});