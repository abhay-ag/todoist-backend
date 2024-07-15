import express from "express";
import { authVerifier } from "../middlewares/auth.js";

const TodoRouter = express.Router();

TodoRouter.use(authVerifier);

TodoRouter.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  res.status(200).json({ token: req.user, userId });
});

export default TodoRouter;
