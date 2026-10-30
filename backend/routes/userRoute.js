import express from 'express';
import { loginUser, registerUser, adminLogin, getMyProfile, updateMyProfile, updateMyPassword } from '../controllers/userController.js';
import authUser from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";

const userRouter = express.Router();

userRouter.post('/register', authLimiter, registerUser)
userRouter.post('/login', authLimiter, loginUser)
userRouter.post('/admin', authLimiter, adminLogin)
userRouter.get("/me", authUser, getMyProfile);
userRouter.patch("/me", authUser, updateMyProfile);
userRouter.patch("/me/password", authUser, authLimiter, updateMyPassword);

export default userRouter;
