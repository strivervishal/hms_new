const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  department: { type: String, required: true },
  doctor: { type: String, required: true },
  visitedBefore: { type: Boolean, default: false },
  booked: { type: Boolean, default: true },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
