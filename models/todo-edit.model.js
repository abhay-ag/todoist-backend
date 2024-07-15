import mongoose from "mongoose";

const actionSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["Update Priority", "Update Status", "Update Content"],
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

const EditTodo = mongoose.model("EditTodo", editSchema);
export default EditTodo;
