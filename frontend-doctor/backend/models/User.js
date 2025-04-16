const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  patient_fullName: { type: String, required: true },
  patient_dob: { type: Date, required: true },
  patient_gender: { type: String, required: true },
  patient_bloodGroup: { type: String },
  patient_maritalStatus: { type: String },
  patient_phone: { type: String, required: true },
  patient_email: { type: String, required: true, unique: true },
  patient_password: { type: String, required: true },
  patient_address: { type: String },
  patient_emergencyContactName: { type: String },
  patient_emergencyContactRelation: { type: String },
  patient_emergencyContactNumber: { type: String },
  patient_medicalConditions: { type: String },
  patient_pastSurgeries: { type: String },
  patient_medications: { type: String },
  patient_allergies: { type: String },
  patient_disabilities: { type: String },
  patient_height: { type: String },
  patient_weight: { type: String },
  patient_prevMedicalReports: [{ type: String }],
});

module.exports = mongoose.model("User", UserSchema);
