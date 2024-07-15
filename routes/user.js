import express from "express";
import { User } from "../models/user.model.js";

const UserRouter = express.Router();

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Bad Request" });
  } else {
    try {
      const resp = await User.findOne({ email });
      if (!resp || !(await resp.comparePassword(password))) {
        throw new Error();
      }
      console.log(resp);
      res.status(200).json({
        user: resp,
      });
    } catch {
      res.status(401).json({ message: "Details Mismatch" });
    }
  }
});

UserRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Bad Request" });
  } else {
    try {
      const user = new User({ email, password });
      await user.save();
      res.status(200).json({ user });
    } catch {
      res.status(400).json({ message: "Not a valid email" });
    }
  }
});

export default UserRouter;
