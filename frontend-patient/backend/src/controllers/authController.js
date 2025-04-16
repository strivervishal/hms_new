const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model
require('dotenv').config();


const multer = require("multer");
const cloudinary = require("cloudinary").v2;


// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;



// Configure Cloudinary
cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,

});

// Configure Multer (for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage });


//Patient Registration
const patientRegister = async (req, res) => {
    try {
      const { 
        patient_fullName,
        patient_dob,
        patient_gender,
        patient_bloodGroup,
        patient_maritalStatus,
        patient_phone,
        patient_email,
        patient_password,
        patient_address,
        patient_emergencyContactName,
        patient_emergencyContactRelation,
        patient_emergencyContactNumber,
        patient_medicalConditions,
        patient_pastSurgeries,
        patient_medications,
        patient_allergies,
        patient_disabilities,
        patient_height,
        patient_weight
       } = req.body;
  

      
  
      
      // Check if username or email already exists
      const existingUser = await User.findOne({ patient_email});
      if (existingUser) {
        return res.status(400).json({ message: "Username or Email already taken" });
      }

      
      
  
      // Upload all medical reports to Cloudinary
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "medical_reports", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          ).end(file.buffer);
        });
      });
  
      const uploadedFiles = await Promise.all(uploadPromises);
  
      // Hash password
      const hashedPassword = await bcrypt.hash(patient_password, 10);
  
      // Save new patient data to MongoDB
      const newUser = new User({
        patient_fullName,
        patient_dob,
        patient_gender,
        patient_bloodGroup,
        patient_maritalStatus,
        patient_phone,
        patient_email,
        patient_password: hashedPassword,
        patient_address,
        patient_emergencyContactName, 
        patient_emergencyContactRelation,
        patient_emergencyContactNumber, 
        patient_medicalConditions,
        patient_pastSurgeries, 
        patient_medications,
        patient_allergies,
        patient_disabilities,
        patient_height,
        patient_weight,
        patient_prevMedicalReports: uploadedFiles, // Store array of uploaded file URLs
      });
  
  
      
      await newUser.save();
  
      
      
      
  
      // Generate JWT Token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(201).json({ message: "Patient registered successfully", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


//Patient Login
const patientLogin = async (req, res) => {
    try {
      const { patient_email, patient_password } = req.body;
      
      
      const user = await User.findOne({ patient_email });
  
      if (!user || !(await bcrypt.compare(patient_password, user.patient_password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
      res.status(200).json({ message: "Login successful", token });
  
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


// Get Patient Profile
const getPatientProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure user ID is extracted from the authenticated request
    const user = await User.findById(userId).select("-patient_password"); // Exclude sensitive data

    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(user); // Return the user profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patient profile" });
  }
};

module.exports = { patientRegister, patientLogin, getPatientProfile };
