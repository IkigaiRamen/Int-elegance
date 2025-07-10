const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Subtask = require("./Subtask");
const TaskSchema = new Schema(
  {
    name: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: Number, default: 0 },
    priority: {
      type: String,
      enum: ["high", "medium", "low", "lowest"],
      default: "medium",
    },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["to do", "in progress", "needs review", "completed"],
      default: "to do",
    },
    subtasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subtask", // This refers to the Subtask model
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Task", TaskSchema);
