const mongoose = require('mongoose');

const unpaidPaymentSchema = new mongoose.Schema({
  doctorName: String,
  specialty: String,
  amount: Number,
  status: { type: String, default: 'unpaid' } // Default status is unpaid
}, {
  timestamps: true
});

module.exports = mongoose.model('UnpaidPayment', unpaidPaymentSchema);