
const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ahmedmahouachi66:WIgNZnY8TNNRTLDR@clusterapi.az66k47.mongodb.net/?appName=ClusterAPI");
        console.log("Database connected...");
    } catch (error) {
        console.log("Database connection error:", error);
    }
};


module.exports = connectDB;
