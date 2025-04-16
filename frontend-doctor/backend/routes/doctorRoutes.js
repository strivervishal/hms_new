// routes/doctorRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authMiddleware");
const Prescription = require("../models/Prescription");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Register Doctor
router.post(
  "/",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "achievements", maxCount: 10 },
    { name: "awards", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, email, password, phone, specialization, availability } =
        req.body;

      const profileImage = req.files["profileImage"]
        ? req.files["profileImage"][0].path
        : "";

      const achievements = JSON.parse(req.body.achievements || "[]").map(
        (ach, index) => ({
          title: ach.title,
          description: ach.description,
          image: req.files[`achievements[${index}][image]`]
            ? req.files[`achievements[${index}][image]`][0].path
            : "",
        })
      );

      const awards = JSON.parse(req.body.awards || "[]").map(
        (award, index) => ({
          title: award.title,
          description: award.description,
          image: req.files[`awards[${index}][image]`]
            ? req.files[`awards[${index}][image]`][0].path
            : "",
        })
      );

      const hashedPassword = await bcrypt.hash(password, 10);
      const newDoctor = new Doctor({
        name,
        email,
        password: hashedPassword,
        phone,
        specialization,
        availability,
        profileImage,
        achievements,
        awards,
      });

      await newDoctor.save();
      res.status(201).json({ message: "Doctor profile added successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Doctor Login - JWT Authentication
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor)
      return res.status(400).json({ error: "Invalid credentials: Email not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials: Incorrect password" });

    const token = jwt.sign(
      { doctorId: doctor._id, email: doctor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout Route (Invalidates Token)
router.post("/logout", authMiddleware, (req, res) => {
  try {
    // Implement token invalidation logic here if using a token blacklist
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error during logout" });
  }
});

// Get Doctor by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const doctor = await Doctor.findById(id).select("-password");
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.json(doctor);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get Doctor Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Doctor ID from Token:", req.doctorId); // Debugging log

    if (!req.doctorId) {
      return res.status(400).json({ error: "Invalid doctor ID" });
    }

    const doctor = await Doctor.findById(req.doctorId).select("-password");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all doctors for availability
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("name _id");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Post the prescription data to database
router.post("/add/prescription", authMiddleware, async (req, res) => {
  try {
    const newPrescription = new Prescription(req.body);
    await newPrescription.save();
    res.status(201).json({ message: "Prescription added successfully" });
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all prescription records
router.get("/get/prescriptions", async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
