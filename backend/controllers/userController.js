import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
            return res.json({ success: false, message: "Email and password are required" })
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email || !password) {
            return res.json({ success: false, message: "Name, email and password are required" })
        }

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name.trim(),
            email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // never embed the password in the token: JWT payloads are only base64-encoded
            const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// GET /api/user/me
const getMyProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("name email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/user/me
const updateMyProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email } = req.body;

        const updates = {};
        if (typeof name === "string" && name.trim()) updates.name = name.trim();
        if (typeof email === "string" && email.trim()) {
            // Validate email format
            if (!validator.isEmail(email.trim())) {
                return res.status(400).json({ success: false, message: "Please enter a valid email" });
            }
            // Ensure email not used by someone else
            const exists = await userModel.findOne({ email: email.trim(), _id: mongoose.trusted({ $ne: userId }) });
            if (exists) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
            updates.email = email.trim();
        }

        const updated = await userModel
            .findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true })
            .select("name email");

        if (!updated) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user: updated });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/user/me/password
const updateMyPassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (typeof currentPassword !== "string" || !currentPassword) {
            return res.status(400).json({ success: false, message: "Current password is required" });
        }
        if (typeof newPassword !== "string" || newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(userId, { $set: { password: hashed } });

        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.error("Password update error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export { loginUser, registerUser, adminLogin, getMyProfile, updateMyProfile, updateMyPassword }
