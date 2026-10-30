import mongoose from "mongoose";

// Strip query operators (e.g. { $ne: null }) from user-supplied filter values
mongoose.set('sanitizeFilter', true)

const connectDB= async()=> {

    mongoose.connection.on('connected',()=> {
        console.log("DB Connected");

    })
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'florazon' })

}

export default connectDB;
