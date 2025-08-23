import express from 'express';
import { loginUser,registerUser,adminLogin, getMyProfile, updateMyProfile, updateMyPassword,} from '../controllers/userController.js';
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get("/me", authUser, getMyProfile);
userRouter.patch("/me", authUser, updateMyProfile);
userRouter.patch("/me/password", authUser, updateMyPassword);

export default userRouter;
