const express = require("express");
const router = express.Router();
const UnpaidPayments = require("../models/unpaidPaymentModel"); // Assuming the model is named UnpaidPayments
const jwt = require("jsonwebtoken");

// Add a new unpaid payment
router.post("/unpaid-payments", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { doctorName, specialty, amount } = req.body;

    // Save the payment to the unpaidPayments table
    const newUnpaidPayment = new UnpaidPayments({
      doctorName,
      specialty,
      amount,
      userId: decoded.id, // Assuming the user ID is stored in the token
      status: "unpaid",
      createdAt: new Date(),
    });

    const savedPayment = await newUnpaidPayment.save();

    res.status(201).json({ message: "Payment added successfully", payment: savedPayment });
  } catch (error) {
    console.error("Error adding unpaid payment:", error.message);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

// Fetch unpaid payments
router.get("/unpaid-payments", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const unpaidPayments = await UnpaidPayments.find({ userId: decoded.id, status: "unpaid" });

    res.json(unpaidPayments);
  } catch (error) {
    console.error("Error fetching unpaid payments:", error.message);
    res.status(500).json({ error: "Failed to fetch unpaid payments" });
  }
});

module.exports = router;