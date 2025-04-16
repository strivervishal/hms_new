const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  patient_fullName: { type: String, required: true },
  patient_dob: { type: String, required: true },
  patient_gender: { type: String, required: true },
  patient_bloodGroup: { type: String, required: true },
  patient_maritalStatus: { type: String, required: true },
  patient_phone: { type: String, required: true },
  patient_email: { type: String, unique: true, required: [true, "Email is required"] }, // ✅ Prevents null emails
  patient_password: { type: String, required: true },
  patient_address: { type: String, required: true },
  patient_emergencyContactName: { type: String, required: true },
  patient_emergencyContactRelation: { type: String, required: true },
  patient_emergencyContactNumber: { type: String, required: true },
  patient_medicalConditions: String,
  patient_pastSurgeries: String,
  patient_medications: String,
  patient_allergies: String,
  patient_disabilities: String,
  patient_height:String,
  patient_weight:String,
  patient_prevMedicalReports: [String],
});

// ✅ Ensure correct collection name
const User = mongoose.model("User", PatientSchema);

module.exports = User;


