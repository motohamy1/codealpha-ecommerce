import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/userRoute.js";

// import cors from "cors";
// import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



// app.use(cors());
app.use(express.json());
app.use('/user', router)
app.use(express.static(publicDir));

app.get("/api", (req, res) => {
  res.json({ message: "E-commerce API is running!" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
