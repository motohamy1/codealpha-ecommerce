import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/userRoute.ts";
import productRouter from "./routes/productRoute.ts";
import cartRouter from "./routes/cartRoute.ts";

import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use(cors());
app.use(express.json());

app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter);

console.log('Product route mounted');
// app.use(express.static(publicDir));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(publicDir, "index.html"));
// });

app.get("/api", (req, res) => {
  res.json({ message: "E-commerce API is running!" });
});

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
