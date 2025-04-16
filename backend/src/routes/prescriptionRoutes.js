const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription"); // Ensure this path is correct

// Fetch prescriptions for a specific patient
router.get("/prescriptions", async (req, res) => {
  try {
    const { patientName } = req.query; // Get the patient name from query parameters

    // If patientName is provided, filter prescriptions by patientName
    const prescriptions = patientName
      ? await Prescription.find({ patientName })
      : await Prescription.find();

    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error.message);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

module.exports = router;