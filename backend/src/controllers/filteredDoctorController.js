const Doctor = require("../models/Doctor");
const Availability = require("../models/Availability");

const getFilteredDoctors = async (req, res) => {
    try {
        const { specialization, date } = req.query; // Get specialization & date from frontend
        
        if (!specialization || !date) {
            return res.status(400).json({ error: "Specialization and Date are required" });
        }

        // Find doctors with the selected specialization
        const doctors = await Doctor.find({ specialization });

        // Fetch availability for each doctor on the selected date
        const doctorsWithSlots = await Promise.all(
            doctors.map(async (doctor) => {
                const availability = await Availability.findOne({
                    doctorName: doctor.name,
                    date: date,
                });

                return {
                    _id: doctor._id,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    availableSlots: availability ? availability.availableSlots : [],
                };
            })
        );

        console.log("Filtered Doctors:", doctorsWithSlots); // Debugging log

        res.json(doctorsWithSlots);
    } catch (error) {
        console.error("Error fetching filtered doctors:", error);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
};

module.exports = { getFilteredDoctors };
