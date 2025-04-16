const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    availableSlots: { type: [String], default: [] }
}, { timestamps: true });

const Availability = mongoose.model("Availability", availabilitySchema);
module.exports = Availability;
