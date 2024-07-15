import express from "express";
import { authVerifier } from "../middlewares/auth.js";
import TodoModel from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import EditTodo from "../models/todo-edit.model.js";

const TodoRouter = express.Router();

TodoRouter.use(authVerifier);

TodoRouter.post("/new", async (req, res) => {
  const { content, status, priority } = req.body;
  const userId = req.user.id;

  const todo = new TodoModel({
    content,
    status,
    priority,
    userId,
  });

  await todo.save();

  const init = new EditTodo({
    todoId: todo._id,
    actions: [
      {
        action: "Creation",
        oldValue: null,
        newValue: content,
      },
    ],
  });

  await init.save();
  res.status(200).json({ message: "true" });
});

TodoRouter.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new Error();
    }

    if (userId !== req.user.id) {
      throw new Error();
    }

    const resp = await TodoModel.find({ userId: userId });
    res.status(200).json({ message: "success", todos: resp });
  } catch {
    res.status(400).json({ message: "Bad Request" });
  }
});

TodoRouter.put("/update/:taskId", async (req, res) => {
  const todoId = req.params.taskId;
  const { oldValue, newValue, action } = req.body;

  await EditTodo.findOneAndUpdate(
    { todoId: todoId },
    {
      $push: {
        actions: {
          action,
          oldValue,
          newValue,
        },
      },
    }
  );

  switch (action) {
    case "Update Priority":
      await TodoModel.findOneAndUpdate(
        { _id: todoId },
        {
          priority: newValue,
        }
      );
      break;
    case "Update Status":
      await TodoModel.findOneAndUpdate(
        { _id: todoId },
        {
          status: newValue,
        }
      );
      break;
    case "Update Content":
      await TodoModel.findOneAndUpdate(
        { _id: todoId },
        {
          content: newValue,
        }
      );
      break;
  }
  res.status(200).json({ message: "true" });
});

TodoRouter.delete("/delete/:todoId", async (req, res) => {
  const todoId = req.params.todoId;
  await EditTodo.deleteOne({ todoId });
  await TodoModel.deleteOne({ _id: todoId });

  res.status(200).json({
    message: "true",
  });
});

export default TodoRouter;
