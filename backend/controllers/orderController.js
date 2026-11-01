import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js";
import { DELIVERY_FEE, ORDER_STATUSES } from "../config/constants.js";
import { optionPrice, resolveOption } from "../config/productOptions.js";


// Placing orders using COD Method

const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const { items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }
    if (!address || typeof address !== "object") {
      return res.status(400).json({ success: false, message: "Delivery address is required" });
    }
    // Optional delivery day (YYYY-MM-DD, not in the past) and card message (up to 200 characters)
    if (address.deliveryDate !== undefined) {
      const day = /^\d{4}-\d{2}-\d{2}$/.test(address.deliveryDate) ? new Date(`${address.deliveryDate}T23:59:59Z`) : null;
      if (!day || Number.isNaN(day.getTime()) || day.getTime() < Date.now() - 86400000) {
        return res.status(400).json({ success: false, message: "Please choose a valid delivery date" });
      }
    }
    if (address.giftMessage !== undefined) {
      if (typeof address.giftMessage !== "string" || address.giftMessage.length > 200) {
        return res.status(400).json({ success: false, message: "The card message can be up to 200 characters" });
      }
    }

    // Rebuild items from the database so prices can't be tampered with client-side
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: "Invalid item quantity" });
      }
      const product = mongoose.isValidObjectId(item?._id) ? await productModel.findById(item._id).lean() : null;
      if (!product) {
        return res.status(400).json({ success: false, message: "A product in your cart is no longer available" });
      }
      // Price each line by its option (stems or tier); unknown options fall back to the base option
      const option = resolveOption(product, item.size);
      const unitPrice = optionPrice(product, option.label);
      orderItems.push({ ...product, size: option.label, price: unitPrice, quantity });
      subtotal += unitPrice * quantity;
    }

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount: subtotal + DELIVERY_FEE,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear cart for this user
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//All Orders data for Admin Panel
const allOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({}).sort({ date: -1 })
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const orders = await orderModel.find({ userId }).sort({ date: 1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Update order status from Admin Panel
const updateStatus = async (req,res) =>{
    try {
        const { orderId, status } = req.body

        if (!mongoose.isValidObjectId(orderId) || !ORDER_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid order or status" })
        }

        const order = await orderModel.findByIdAndUpdate(orderId, { status })
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        res.json({success:true,message:'Status Updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {placeOrder, allOrders, userOrders, updateStatus}