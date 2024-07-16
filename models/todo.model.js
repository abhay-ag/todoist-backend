import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Todo"],
    required: true,
    default: "Todo",
  },
  priority: {
    type: String,
    enum: ["P-0", "P-1", "P-2", "P-3", "P-4"],
    default: "P-4",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TodoModel = mongoose.model("Todos", todoSchema);

export default TodoModel;
