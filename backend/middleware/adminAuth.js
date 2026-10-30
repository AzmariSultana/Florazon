import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if (token_decode.role !== 'admin' || token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).json({ success: false, message: "Session expired. Please log in again." })
    }
}
export default adminAuth
