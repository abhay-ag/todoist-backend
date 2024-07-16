import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// routes
import UserRouter from "./routes/user.js";
import TodoRouter from "./routes/todo.js";

dotenv.config();
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.DB_URL)
  .then((success) => {
    console.log("Successfully connected to DB");
  })
  .catch(() => {
    console.log("Some error occured");
  });

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use("/user", UserRouter);
app.use("/todo", TodoRouter);

app.listen(port, () => {
  console.log("Running server on PORT: ", port);
});
