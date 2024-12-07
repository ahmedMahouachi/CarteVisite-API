
const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ahmedmahouachi66:PRq4eCkr7xSJWOoG@cluster0.rct0q.mongodb.net/?retryWrites=true&w=majority");
        console.log("Database connected...");
    } catch (error) {
        console.log("Database connection error:", error);
    }
};


module.exports = connectDB;
