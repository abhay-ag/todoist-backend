import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["Change Priority", "Update Status"],
      required: true,
    },
    oldValue: {
      type: String,
      required: true,
    },
    newValue: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const editSchema = new mongoose.Schema({
  todoId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todos",
  },
  action: {
    required: true,
    type: [actionSchema],
    default: [],
  },
});
