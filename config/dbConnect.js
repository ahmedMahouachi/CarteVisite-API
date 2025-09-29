
const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ahmedmahouachi66:Aws7rqyif1T3kd4v@clusterapi.az66k47.mongodb.net/");
        console.log("Database connected...");
    } catch (error) {
        console.log("Database connection error:", error);
    }
};


module.exports = connectDB;
