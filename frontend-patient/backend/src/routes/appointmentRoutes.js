const express = require("express");
const {
  bookAppointment,
  getAppointments,
  rescheduleAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/all", getAppointments);
router.put("/reschedule/:id", rescheduleAppointment);
router.delete("/cancel/:id", cancelAppointment);

module.exports = router;
