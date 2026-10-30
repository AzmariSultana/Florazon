import fs from "fs/promises"
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    const uploaded = Object.values(req.files || {}).flat()
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        if (!name || !description || !price || !category || !subCategory) {
            return res.json({ success: false, message: "Please fill in all product details" })
        }

        const parsedSizes = JSON.parse(sizes || "[]")
        const parsedPrice = Number(price)
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return res.json({ success: false, message: "Please enter a valid price" })
        }
        if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
            return res.json({ success: false, message: "Please select at least one size" })
        }

        const files = req.files || {}
        const image1 = files.image1 && files.image1[0]
        const image2 = files.image2 && files.image2[0]
        const image3 = files.image3 && files.image3[0]
        const image4 = files.image4 && files.image4[0]

        const images= [image1,image2,image3,image4].filter((item)=> item != undefined)
        if (images.length === 0) {
            return res.json({ success: false, message: "Please upload at least one image" })
        }

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: parsedPrice,
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    } finally {
        // multer keeps uploads in the OS temp folder; remove them once Cloudinary has them
        await Promise.all(uploaded.map((file) => fs.unlink(file.path).catch(() => {})))
    }

}

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }

}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.body.id)) {
            return res.status(400).json({ success: false, message: "Invalid product id" })
        }
        const product = await productModel.findByIdAndDelete(req.body.id)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        res.json({success:true,message:"Product Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }

}

// function for single product
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product id" })
        }
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})

    }
}

export { listProducts, addProduct, removeProduct, singleProduct }
