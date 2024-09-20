import { Router } from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";

const ordersRouter = Router();

// Create Order
ordersRouter.post("/", async (req, res) => {
  try {
    const { user_id, product_name, price } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let finalPrice = price;
    if (user.rate_discount) {
      finalPrice = price - price * (user.rate_discount / 100);
    }

    if (user.wallet < finalPrice) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    user.wallet -= finalPrice;
    await user.save();

    const newOrder = new Order({
      user_id,
      product_name,
      price: price,
    });

    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully!", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

//Get Order List
ordersRouter.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user_id", "full_name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

//Get Order List By User Id
ordersRouter.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user_id: userId }).populate(
      "user_id",
      "full_name email"
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders by user ID:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
});

export default ordersRouter;
