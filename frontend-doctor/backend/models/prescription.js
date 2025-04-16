const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  diagnosis: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      notes: { type: String },
    },
  ],
  surgeries: { type: String },
  followUp: {
    nextDate: { type: String },
    nextNotes: { type: String },
  },
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
