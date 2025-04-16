// This schema is for doctor free/available slots

const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    doctorName: { type: String, required: true },
    date: { type: String, required: true }, 
    availableSlots: { type: [String], required: true }, 
  },
  { timestamps: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
