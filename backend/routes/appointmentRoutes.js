const express = require('express');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Fetch all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});

// Add a new appointment (Optional)
router.post('/', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding appointment', error });
    }
});

module.exports = router;
