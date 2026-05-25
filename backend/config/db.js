import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("FULL MONGODB ERROR:");
        console.error(error);
    }
};

export default connectDb;