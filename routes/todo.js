import express from "express";
import { authVerifier } from "../middlewares/auth.js";
import TodoModel from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import EditTodo from "../models/todo-edit.model.js";

const TodoRouter = express.Router();

TodoRouter.use(authVerifier);

TodoRouter.post("/new", async (req, res) => {
  const { content, status, priority, title, dueDate } = req.body;
  const userId = req.user.id;

  const todo = new TodoModel({
    content,
    status,
    priority,
    userId,
    title,
    dueDate,
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
  res.status(200).json({ todo });
});

TodoRouter.get("/user", async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      throw new Error();
    }

    if (userId !== req.user.id) {
      throw new Error();
    }

    const resp = await TodoModel.find({ userId: userId }).sort({
      createdAt: -1,
    });
    delete resp.userId;
    delete resp.__v;
    res.status(200).json({ todos: resp });
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
    case "Update Title":
      await TodoModel.findOneAndUpdate(
        { _id: todoId },
        {
          title: newValue,
        }
      );
      break;
    case "Update Due Date":
      await TodoModel.findOneAndUpdate(
        { _id: todoId },
        {
          dueDate: newValue,
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

TodoRouter.get("/updates/:taskId", async (req, res) => {
  const taskId = req.params.taskId;

  const resp = await EditTodo.findOne(
    { todoId: taskId },
    { actions: 1, _id: 0 }
  );
  console.log(resp);

  res.status(200).json({ actions: resp });
});

export default TodoRouter;
