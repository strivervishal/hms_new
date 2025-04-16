const express = require("express");
const { getFilteredDoctors } = require("../controllers/filteredDoctorController"); 

const router = express.Router();

router.get("/", getFilteredDoctors);

module.exports = router;
