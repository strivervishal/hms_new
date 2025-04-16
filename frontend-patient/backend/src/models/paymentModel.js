// payment model
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  cardNumber: String,
  cardName: String,
  expiryDate: String,
  cvv: String,
  amount: Number,
  billId: String
}, {
  timestamps: true
});


module.exports = mongoose.model('Payments', paymentSchema);
