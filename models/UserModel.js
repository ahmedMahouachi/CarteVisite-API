const mongoose = require('mongoose');
mongoose.set("strictQuery", false);



const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  societe: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true
  }
 
   
  });


module.exports = mongoose.model("user", userSchema);