const User = require('../models/UserModel'); 
const jwt = require("jsonwebtoken");
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


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
  
      // Erreur intentionnelle : mauvaise clé pour décoder le token
      const decoded = jwt.verify(token, "secretJWT"); 
  
      const userId = decoded.id;
  
      const { fullName, societe, phoneNumber } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Erreur intentionnelle : logique incorrecte pour mettre à jour le téléphone
      if (phoneNumber && phoneNumber.length < 8) { 
        user.phoneNumber = "00000000"; // Remplacer par une valeur par défaut incorrecte
      }
  
      if (fullName) user.fullName = fullName;
      if (societe) user.societe = societe;
  
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

  
  exports.generateCv = async (req, res) => {
      try {
          const { personalInfo, experiences, skills, languages } = req.body;
  
          if (!personalInfo || !experiences || !skills || !languages) {
              return res.status(400).json({ message: "Invalid input. Please provide all required fields." });
          }
  
          // Générer un nom de fichier unique
          const uniqueId = Date.now(); // Identifiant unique basé sur l'heure actuelle
          const fileName = `${personalInfo.fullName.replace(/\s+/g, '_')}_${uniqueId}.pdf`;
  
          // Définir le chemin du dossier 'public' en remontant d'un niveau
          const dirPath = path.join(__dirname, '..', 'public', 'cvs');
          const filePath = path.join(dirPath, fileName);
  
          // Créer un répertoire s'il n'existe pas
          if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
          }
  
          // Créer un nouveau document PDF
          const doc = new PDFDocument();
          const writeStream = fs.createWriteStream(filePath);
          doc.pipe(writeStream);
  
          // Ajouter une image statique dans le header
          const staticImagePath = path.join(__dirname, '..', 'public', 'images', 'logo.png'); // chemin de l'image statique
          doc.image(staticImagePath, { width: 100, height: 50 }).moveDown(0.5);
  
          // Ajouter le texte "Consulting School" dans le header
          doc.fontSize(20).text('Consulting School', { align: 'center' }).moveDown();
  
          // Ajouter un espace avant le reste du contenu
          doc.moveDown();
  
          // Générer le contenu du CV
          doc.fontSize(20).text('Curriculum Vitae', { align: 'center' }).moveDown();
          doc.fontSize(14).text(`Name: ${personalInfo.fullName}`);
          doc.text(`Email: ${personalInfo.email}`);
          doc.text(`Phone: ${personalInfo.phoneNumber}`);
          if (personalInfo.address) {
              doc.text(`Address: ${personalInfo.address}`);
          }
          doc.moveDown();
  
          // Section Expérience
          doc.fontSize(16).text('Experience:', { underline: true }).moveDown(0.5);
          experiences.forEach((exp, index) => {
              doc.fontSize(14).text(`${index + 1}. ${exp.position} at ${exp.company}`);
              doc.text(`   - Duration: ${exp.duration}`);
              doc.text(`   - Description: ${exp.description}`).moveDown(0.5);
          });
  
          // Section Compétences
          doc.fontSize(16).text('Skills:', { underline: true }).moveDown(0.5);
          skills.forEach((skill, index) => {
              doc.fontSize(14).text(`${index + 1}. ${skill}`);
          });
          doc.moveDown();
  
          // Section Langues
          doc.fontSize(16).text('Languages:', { underline: true }).moveDown(0.5);
          languages.forEach((lang, index) => {
              doc.fontSize(14).text(`${index + 1}. ${lang}`);
          });
  
          // Finaliser le document
          doc.end();
  
          writeStream.on('finish', () => {
              const fileUrl = `http://${req.headers.host}/cvs/${fileName}`; // Lien dynamique
              res.status(201).json({
                  message: "CV generated successfully",
                  cvLink: fileUrl,
              });
          });
  
          writeStream.on('error', (error) => {
              console.error("Error writing file:", error);
              res.status(500).json({ message: "Failed to generate CV", error });
          });
      } catch (error) {
          console.error("Error generating CV:", error);
          res.status(500).json({ message: "An unexpected error occurred", error });
      }
  };
  
  exports.getAllProfiles = async (req, res) => {
    try {
      const users = await User.find({}, '-password'); // Exclure les mots de passe
      res.status(200).json({
        message: "All user profiles retrieved successfully",
        users,
      });
    } catch (error) {
      console.error("Error retrieving all profiles:", error);
      res.status(500).json({ message: "An unexpected error occurred", error });
    }
  };
  
