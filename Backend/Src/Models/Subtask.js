const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubtaskSchema = new Schema(
  {
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["to do", "in progress", "needs review", "completed"],
      default: "to do",
      required: true,
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    priority: {
      type: String,
      enum: ["high", "medium", "low", "lowest"],
      default: "medium",
    },
    predecessor: { type: String , required: false }, 
    parentTaskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subtask", SubtaskSchema);
