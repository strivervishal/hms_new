// This route is for adding free slots to the database and check the slot is existing in database or not

const express = require("express");
const router = express.Router();
const Availability = require("../models/Availability");

// Route to save doctor availability
router.post("/", async (req, res) => {
  try {
    const { doctorName, date, availableSlots } = req.body;

    // Check if availability already exists for this doctor on this date
    const existingAvailability = await Availability.findOne({ doctorName, date });

    if (existingAvailability) {
      
      existingAvailability.availableSlots = availableSlots;
      await existingAvailability.save();
      return res.status(200).json({ message: "Availability updated successfully!" });
    }


    const newAvailability = new Availability({
      doctorName,
      date,
      availableSlots,
    });

    await newAvailability.save();
    res.status(201).json({ message: "Availability saved successfully!" });
  } catch (error) {
    console.error("Error saving availability:", error);
    res.status(500).json({ message: "Error saving availability." });
  }
});

module.exports = router;
