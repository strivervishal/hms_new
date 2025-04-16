const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  date: { type: Date, required: true },
  diagnosis: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
    },
  ],
  surgeries: { type: String },
  followUp: {
    nextDate: { type: Date },
  },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
