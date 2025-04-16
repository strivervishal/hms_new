const Prescription = require("../models/Prescription");

// ✅ Get all prescriptions
const getPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find();
        res.json(prescriptions);
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        res.status(500).json({ error: "Failed to fetch prescriptions" });
    }
};

module.exports = { getPrescriptions };
