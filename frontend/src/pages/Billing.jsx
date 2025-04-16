import { useState } from 'react';
import { FaCreditCard, FaHistory, FaFileInvoice, FaDownload } from 'react-icons/fa';
import { validateCardNumber, validateExpiryDate, validateCVV, formatCardNumber, formatCurrency } from '../utils/validation';
import Toast from '../components/Toast';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation


//frontend billing
const Billing = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      date: '2025-04-10',
      dueDate: '2025-04-24',
      description: 'Cardiology Consultation',
      amount: 250.00,
      status: 'unpaid',
      doctor: 'Dr. Sarah Johnson',
      facility: 'Heart Care Center',
      items: [
        { description: 'Initial Consultation', amount: 200.00 },
        { description: 'ECG Test', amount: 50.00 }
      ]
    },
    {
      id: 2,
      date: '2025-03-15',
      dueDate: '2025-03-29',
      description: 'Laboratory Tests',
      amount: 175.00,
      status: 'paid',
      doctor: 'Dr. Emily Rodriguez',
      facility: 'Community Health Center',
      items: [
        { description: 'Blood Work', amount: 125.00 },
        { description: 'Urinalysis', amount: 50.00 }
      ]
    },
    {
      id: 3,
      date: '2025-02-20',
      dueDate: '2025-03-06',
      description: 'Physical Therapy Session',
      amount: 150.00,
      status: 'paid',
      doctor: 'Dr. Michael Chen',
      facility: 'Rehabilitation Center',
      items: [
        { description: 'Therapy Session (1 hour)', amount: 150.00 }
      ]
    }
  ]);

  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('unpaid');

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [newPayment, setNewPayment] = useState({
    doctorName: '',
    specialty: '',
    amount: ''
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateCardNumber(paymentInfo.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }
    if (!paymentInfo.cardName.trim()) {
      newErrors.cardName = 'Name is required';
    }
    if (!validateExpiryDate(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date';
    }
    if (!validateCVV(paymentInfo.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = formatCardNumber(value);
    setPaymentInfo({ ...paymentInfo, cardNumber: value });
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentInfo({ ...paymentInfo, expiryDate: value });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setToast({
        show: true,
        message: "Please correct the errors in the form",
        type: "error",
      });
      return;
    }
  
    const paymentData = {
      cardNumber: paymentInfo.cardNumber,
      cardName: paymentInfo.cardName,
      expiryDate: paymentInfo.expiryDate,
      cvv: paymentInfo.cvv,
      amount: selectedBill.amount,
      billId: selectedBill.id,
    };
  
    try {
      console.log("Sending payment data:", paymentData); // Debugging log
  
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData); // Log backend error
        throw new Error("Failed to process payment");
      }
  
      const savedPayment = await response.json();
      console.log("Saved payment:", savedPayment); // Debugging log
  
      // Update the bill with payment details
      setBills(
        bills.map((bill) =>
          bill.id === selectedBill.id
            ? {
                ...bill,
                status: "paid",
                paymentDetails: {
                  cardNumber: paymentInfo.cardNumber,
                  cardName: paymentInfo.cardName,
                  expiryDate: paymentInfo.expiryDate,
                  cvv: paymentInfo.cvv,
                  amount: selectedBill.amount,
                  billId: selectedBill.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              }
            : bill
        )
      );
  
      setShowPaymentModal(false);
      setPaymentInfo({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
      });
  
      setToast({
        show: true,
        message: "Payment processed successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      setToast({
        show: true,
        message: "Payment processing failed. Please try again.",
        type: "error",
      });
    }
  };

  const handleDownloadPDF = (bill) => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text(`Bill Details: ${bill.description}`, 10, 10);
    doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, 10, 20);
    doc.text(`Due Date: ${new Date(bill.dueDate).toLocaleDateString()}`, 10, 30);
    doc.text(`Doctor: ${bill.doctor}`, 10, 40);
    doc.text(`Facility: ${bill.facility}`, 10, 50);
    doc.text(`Amount: ${formatCurrency(bill.amount)}`, 10, 60);
    
    // Add payment details if available
    if (bill.paymentDetails) {
      doc.text(`Card Number: ${bill.paymentDetails.cardNumber}`, 10, 70);
      doc.text(`Cardholder Name: ${bill.paymentDetails.cardName}`, 10, 80);
      doc.text(`Expiry Date: ${bill.paymentDetails.expiryDate}`, 10, 90);
      doc.text(`CVV: ${bill.paymentDetails.cvv}`, 10, 100);
      doc.text(`Created At: ${new Date(bill.paymentDetails.createdAt).toLocaleString()}`, 10, 110);
      doc.text(`Updated At: ${new Date(bill.paymentDetails.updatedAt).toLocaleString()}`, 10, 120);
    }

    // Add items to the PDF
    doc.text('Items:', 10, 130);
    bill.items.forEach((item, index) => {
      doc.text(`${item.description}: ${formatCurrency(item.amount)}`, 10, 140 + (index * 10));
    });

    // Save the PDF
    doc.save(`bill_${bill.id}.pdf`);

    // Show toast notification
    setToast({
      show: true,
      message: 'PDF download started',
      type: 'success'
    });
  };

  const filteredBills = bills.filter(
    bill => activeTab === 'unpaid' ? bill.status === 'unpaid' : bill.status === 'paid'
  );

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handleAddPayment = () => {
    const newBill = {
      id: bills.length + 1, // Incremental ID
      date: new Date().toISOString().split('T')[0], // Today's date
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], // Due in 14 days
      description: `${newPayment.specialty} Consultation`,
      amount: parseFloat(newPayment.amount),
      status: 'unpaid',
      doctor: newPayment.doctorName,
      facility: 'Unknown', // You can modify this as needed
      items: [] // No items for this new payment
    };

    setBills([...bills, newBill]);
    setNewPayment({ doctorName: '', specialty: '', amount: '' }); // Reset the input fields
    setToast({
      show: true,
      message: 'New payment added successfully',
      type: 'success'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-dark dark:text-white">Billing & Payments</h1>
          <p className="text-neutral-darkest dark:text-neutral-light">Manage your medical bills and payments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn btn-primary">Payment History</button>
        </div>
      </div>

      {/* New Payment Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-dark-dark dark:text-white">Add New Payment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">Doctor's Name</label>
            <input
              type="text"
              value={newPayment.doctorName}
              onChange={(e) => setNewPayment({ ...newPayment, doctorName: e.target.value })}
              className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">Specialty</label>
            <input
              type="text"
              value={newPayment.specialty}
              onChange={(e) => setNewPayment({ ...newPayment, specialty: e.target.value })}
              className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">Amount</label>
            <input
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
              required
            />
          </div>
          <button onClick={handleAddPayment} className="btn btn-primary">Add Payment</button>
        </div>
      </div>

      <div className="card">
        <div className="flex border-b border-neutral dark:border-dark-light mb-4">
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'unpaid' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-neutral-darkest dark:text-neutral-light'
            }`}
            onClick={() => setActiveTab('unpaid')}
          >
            Unpaid Bills
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'paid' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-neutral-darkest dark:text-neutral-light'
            }`}
            onClick={() => setActiveTab('paid')}
          >
            Payment History
          </button>
        </div>

        {filteredBills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral dark:divide-dark-light">
              <thead className="bg-neutral-lightest dark:bg-dark">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Bill Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-light divide-y divide-neutral dark:divide-dark">
                {filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-neutral-lightest dark:hover:bg-dark">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                          <FaFileInvoice />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark-dark dark:text-white">{bill.description}</div>
                          <div className="text-sm text-neutral-darkest dark:text-neutral-light">{bill.doctor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-dark dark:text-white">
                        {new Date(bill.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-neutral-darkest dark:text-neutral-light">
                        Due: {new Date(bill.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-dark-dark dark:text-white">
                        {formatCurrency(bill.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        bill.status === 'paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(bill)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        View Details
                      </button>
                      {bill.status === 'unpaid' && (
                        <button 
                          onClick={() => handlePayment(bill)}
                          className="text-accent hover:text-accent-dark"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-darkest dark:text-neutral-light">No {activeTab} bills found.</p>
          </div>
        )}
      </div>

      {/* Bill Details Modal */}
      {showModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-light rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedBill.status === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {selectedBill.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                  <h3 className="text-lg font-semibold text-dark-dark dark:text-white mt-1">{selectedBill.description}</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-neutral-darkest dark:text-neutral-light hover:text-dark-dark dark:hover:text-white"
                >
                  &times;
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Bill Date</p>
                  <p className="text-md text-dark-dark dark:text-white">
                    {new Date(selectedBill.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Due Date</p>
                  <p className="text-md text-dark-dark dark:text-white">
                    {new Date(selectedBill.dueDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Doctor</p>
                  <p className="text-md text-dark-dark dark:text-white">{selectedBill.doctor}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Facility</p>
                  <p className="text-md text-dark-dark dark:text-white">{selectedBill.facility}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-dark-dark dark:text-white mb-2">Bill Items</h4>
                <div className="bg-neutral-lightest dark:bg-dark rounded-md p-4">
                  <div className="space-y-2">
                    {selectedBill.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-dark-dark dark:text-white">{item.description}</span>
                        <span className="text-dark-dark dark:text-white">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-neutral dark:border-dark-light">
                      <div className="flex justify-between font-medium">
                        <span className="text-dark-dark dark:text-white">Total Amount</span>
                        <span className="text-dark-dark dark:text-white">{formatCurrency(selectedBill.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => handleDownloadPDF(selectedBill)}
                  className="btn btn-outline flex items-center"
                >
                  <FaDownload className="mr-2" /> Download PDF
                </button>
                {selectedBill.status === 'unpaid' && (
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      handlePayment(selectedBill);
                    }}
                    className="btn btn-primary"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-light rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-dark-dark dark:text-white">Payment Details</h3>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-neutral-darkest dark:text-neutral-light hover:text-dark-dark dark:hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-neutral-darkest dark:text-neutral-light">Amount to Pay</p>
                <p className="text-xl font-semibold text-dark-dark dark:text-white">{formatCurrency(selectedBill.amount)}</p>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                      className={`w-full p-2 border ${
                        errors.cardNumber ? 'border-red-500' : 'border-neutral dark:border-dark-light'
                      } rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white`}
                      required
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                      className={`w-full p-2 border ${
                        errors.cardName ? 'border-red-500' : 'border-neutral dark:border-dark-light'
                      } rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white`}
                      required
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={handleExpiryDateChange}
                        maxLength="5"
                        className={`w-full p-2 border ${
                          errors.expiryDate ? 'border-red-500' : 'border-neutral dark:border-dark-light'
                        } rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white`}
                        required
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-dark dark:text-white mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        maxLength="4"
                        className={`w-full p-2 border ${
                          errors.cvv ? 'border-red-500' : 'border-neutral dark:border-dark-light'
                        } rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white`}
                        required
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                  >
                    <FaCreditCard className="mr-2" /> Pay {formatCurrency(selectedBill.amount)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default Billing;