// routes/payment.js
//payment route
const express = require("express");
const router = express.Router();
const Payments = require("../models/paymentModel");
const jwt = require("jsonwebtoken");

// POST: Save payment
router.post("/", async (req, res) => {
  try {
    const payment = new Payments(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payments.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process payment
router.post("/payments", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { cardNumber, cardName, expiryDate, cvv, amount, billId } = req.body;

    // Save the payment to the database
    const newPayment = new Payments({
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      amount,
      billId,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({ message: "Payment processed successfully", payment: savedPayment });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

module.exports = router;
