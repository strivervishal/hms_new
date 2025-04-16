const express = require("express");
const { patientRegister, patientLogin, getPatientProfile, loginUser } = require("../controllers/authController");
const multer = require("multer");
const { protect, authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/patientRegister", upload.array("patient_prevMedicalReports", 5), patientRegister);
router.post('/patientLogin', patientLogin);


router.get("/me", authenticate, getPatientProfile);
router.get("/getPatientProfile", authenticate, getPatientProfile);

module.exports = router;

