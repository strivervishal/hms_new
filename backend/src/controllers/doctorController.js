const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");

const getDoctors = async (req, res) => {
    try {
        const { date } = req.query; // Get selected date from frontend
        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }

        // Get all doctors
        const doctors = await Doctor.find();

        // Fetch availability for each doctor based on the selected date
        const doctorsWithSlots = await Promise.all(
            doctors.map(async (doctor) => {
                // Find availability for this doctor on the selected date
                const availability = await Availability.findOne({
                    doctorName: doctor.name, // Match doctor name
                    date: date, // Match the selected date
                });

                return {
                    _id: doctor._id,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    availableSlots: availability ? availability.availableSlots : [], // Only slots for selected date
                };
            })
        );

        console.log("Doctors with Slots:", doctorsWithSlots); // Debugging log

        res.json(doctorsWithSlots);
    } catch (error) {
        console.error("Error fetching doctors with slots:", error);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
};

module.exports = { getDoctors };
