import express from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users.js";
import ordersRouter from "./routes/orders.js";
import cors from "cors";

const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb://mongo:LFSvhARCtyuaTAzLRAeMjZscRYBNAMAz@autorack.proxy.rlwy.net:34319",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use(cors());

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
