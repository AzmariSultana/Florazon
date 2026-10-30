import mongoose from "mongoose"
import userModel from "../models/userModel.js"

// Cart keys come from the client and are used as object keys, so they must be safe
const isValidCartKey = (itemId, size) =>
    mongoose.isValidObjectId(itemId) &&
    typeof size === "string" && size.length > 0 && size.length <= 30 &&
    !["__proto__", "constructor", "prototype"].includes(size)

// add products to user cart
const addToCart = async (req,res) => {
    try {
        const userId = req.userId
        const { itemId, size } = req.body

        if (!isValidCartKey(itemId, size)) {
            return res.status(400).json({ success: false, message: "Item and size are required" })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const cartData = userData.cartData || {}

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] +=1
            }
            else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Added to Cart" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// update user cart
const updateCart = async (req,res) => {
    try {
        const userId = req.userId
        const { itemId, size, quantity } = req.body

        const qty = Number(quantity)
        if (!isValidCartKey(itemId, size) || !Number.isInteger(qty) || qty < 0) {
            return res.status(400).json({ success: false, message: "Invalid cart update" })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        const cartData = userData.cartData || {}

        if (!cartData[itemId]) {
            cartData[itemId] = {}
        }
        cartData[itemId][size]= qty

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({ success: true, message: "Cart Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
    
}

// get user cart data
const getUserCart = async (req,res) => {
    try {
        const userData = await userModel.findById(req.userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.json({ success: true, cartData: userData.cartData || {} })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { addToCart, updateCart, getUserCart }
