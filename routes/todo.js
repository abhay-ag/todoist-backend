import express from "express";
import { authVerifier } from "../middlewares/auth.js";
import TodoModel from "../models/todo.model.js";
import { User } from "../models/user.model.js";

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

export default TodoRouter;
