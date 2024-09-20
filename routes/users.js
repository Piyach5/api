import { Router } from "express";
import User from "../models/User.js";

const usersRouter = Router();

//Get All User Data
usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Create User Data
usersRouter.post("/", async (req, res) => {
  try {
    const { full_name, email, password, phone_number, rate_discount, wallet } =
      req.body;
    const user = new User({
      full_name,
      email,
      password,
      phone_number,
      rate_discount,
      wallet,
    });
    await user.save();
    res.status(201).send({ message: "User created", user });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Edit User Data By Id
usersRouter.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Delete User Data By Id
usersRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Top Up User Wallet By User Id
usersRouter.put("/:id/topup", async (req, res) => {
  try {
    const userId = req.params.id;
    const { wallet_topup } = req.body;

    if (typeof wallet_topup !== "number" || wallet_topup <= 0) {
      return res.status(400).json({ error: "Invalid top-up amount" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.wallet += wallet_topup;
    await user.save();

    res.status(200).json({ message: "Wallet topped up successfully!", user });
  } catch (error) {
    console.error("Error topping up wallet:", error);
    res.status(500).json({ error: "Failed to top up wallet" });
  }
});

export default usersRouter;
