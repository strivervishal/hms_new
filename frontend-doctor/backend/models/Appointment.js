const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: String,
    email: String,
    gender: String,
    date: String,
    time: String,
    department: String,
    doctor: String,
    visitedBefore: Boolean,
    booked: Boolean
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
