require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken"); // Import JWT
const connectDB = require("./config/db"); // Import database connection
const doctorRoutes = require("./routes/doctorRoutes");
const userRoutes = require("./routes/userRoutes");
const AvailabilityRoutes = require("./routes/AvailabilityRoutes"); //import route for doctor availability
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());         
app.use(cookieParser());

// Multer for File Uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});
const upload = multer({ storage });

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use("/api/availability", AvailabilityRoutes);
app.use('/api/appointments', appointmentRoutes);  

// Connect to MongoDB and Start Server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
