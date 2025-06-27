import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    title:{ 
            type: String, 
            required: true 
        },
    content:{ 
            type: String,
        }, 
        // for text or extracted PDF
  
    tags:
        [String], // ['Physics', 'Class 12']
    subject:
        { 
            type: String 
        }, // "Biology", "History", etc.
    isPdf: {
      type: Boolean,
      default: false,
    },
    pdfPath: {
      type: String, // path or URL to the uploaded PDF
    },
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);
