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
        
    tags:
        [String], 
    subject:
        { 
            type: String 
        }, 
    isPdf: {
      type: Boolean,
      default: false,
    },
    pdfPath: {
      type: String, 
    },
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);
