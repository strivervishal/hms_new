const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


const connectDB = require("./src/config/db");

// Route Imports
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const doctorRoutes = require("./src/routes/doctorRoutes");
const filteredDoctorRoutes = require("./src/routes/filteredDoctorRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const authRoutes = require("./src/routes/authRoutes");
const unpaidPaymentRoutes = require("./src/routes/unpaidPaymentRoutes");
const prescriptionRoutes = require("./src/routes/prescriptionRoutes");
const userRoutes = require("./src/routes/userRoutes");
const errorHandler = require("./src/middlewares/errorMiddleware");
const notificationRoutes = require('./src/routes/notificationRoutes');


dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cors()); // Enable CORS

// ✅ Connect to MongoDB
// You can use either `connectDB()` or inline mongoose.connect() like below.
connectDB(); // uses config from ./src/config/db.js

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API is running... 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/filtered-doctors", filteredDoctorRoutes);
app.use("/api/payments", paymentRoutes); // 👈 Payment Route
app.use("/api", unpaidPaymentRoutes); // Register the unpaid payments route
app.use("/api", prescriptionRoutes); // Register the prescriptions route
app.use('/api', notificationRoutes);

// ✅ Error Handling Middleware
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
