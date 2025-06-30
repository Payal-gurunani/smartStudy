import mongoose from "mongoose";

const studyScheduleSchema = new mongoose.Schema({
  user: 
  { type: mongoose.Schema.Types.ObjectId, ref: "User", 
    required: true 
},
  noteId: 
  { type: mongoose.Schema.Types.ObjectId, 
    ref: "Note", 
    required: true 
  },
  suggestedDate: 
  { type: Date, 
    required: true 
},
  reason: 
  { 
    type: String 
    },
      status: {
    type: String,
    enum: ["pending", "completed", "skipped"],
    default: "pending"
  }
}, { timestamps: true });

export const StudySchedule = mongoose.model("StudySchedule", studyScheduleSchema);
