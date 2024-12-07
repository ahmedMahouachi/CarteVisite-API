const User = require('../models/UserModel'); 
const jwt = require("jsonwebtoken");


exports.createUser = async (req, res) => {
    try {
      const { email, password, fullName, societe, phoneNumber } = req.body;
  
      const errors = [];
      if (!email) errors.push("Email is required");
      if (!password) errors.push("Password is required");
      if (!fullName) errors.push("Full name is required");
      if (!societe) errors.push("Societe is required");
      if (!phoneNumber) errors.push("Phone number is required");
  
      if (errors.length > 0) {
        return res.status(400).json({ message: "Validation errors", errors });
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
  
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
  
  
      const newUser = new User({
        email,
        password,
        fullName,
        societe,
        phoneNumber,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "An unexpected error occurred", error });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email }, 
        "secretJWT", 
        { expiresIn: "48h" } 
      );
  
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          societe: user.societe,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An unexpected error occurred", error });
    }
  };

  exports.deleteProfile = async (req, res) => {
    try {
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
      }
  
      const decoded = jwt.verify(token, "secretJWT");
  
      const userId = decoded.id;  
  
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User profile deleted successfully" });
    } catch (error) {
      console.error("Error during profile deletion:", error);
      res.status(500).json({ message: "An unexpected error occurred", error });
    }
  };



exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token non fourni' });
    }

    const decoded = jwt.verify(token, "secretJWT");

    const userId = decoded.id; 

    const { fullName, societe, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (societe) user.societe = societe;
    if (phoneNumber) user.phoneNumber = phoneNumber;
  

    await user.save();

    res.status(200).json({ message: "User profile updated successfully", user });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Token non fourni' });
    }

    const decoded = jwt.verify(token, "secretJWT");

    const userId = decoded.id; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        societe: user.societe,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error during profile retrieval:", error);
    res.status(500).json({ message: "An unexpected error occurred", error });
  }
};

exports.getProfileById = async (req, res) => {
    try {
        userId = req.params.userId;
  
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "User profile retrieved successfully",
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          societe: user.societe,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (error) {
      console.error("Error during profile retrieval:", error);
      res.status(500).json({ message: "An unexpected error occurred", error });
    }
  };