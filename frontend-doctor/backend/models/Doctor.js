const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  availability: { type: String, required: true },
  profileImage: { type: String, default: "" },
  achievements: [
    {
      title: String,
      description: String,
      image: String,
    },
  ],
  awards: [
    {
      title: String,
      description: String,
      image: String,
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
