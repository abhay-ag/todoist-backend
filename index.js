import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// env load
dotenv.config();
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Todoist");
});

// db connect
mongoose
  .connect(process.env.DB_URL)
  .then((success) => {
    console.log("Successfully connected to DB");
  })
  .catch(() => {
    console.log("Some error occured");
  });

app.listen(port, () => {
  console.log("Running server on PORT: ", port);
});
