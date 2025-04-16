import React, { useEffect, useState } from "react";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation
import html2canvas from "html2canvas"; // Import html2canvas for rendering HTML to canvas
import { useNavigate } from "react-router-dom";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]); // Prescription records
  const [search, setSearch] = useState(""); // Search input
  const [toast, setToast] = useState({ show: false, message: "", type: "" }); // Toast state

  // Fetch all prescriptions
  const fetchPrescriptions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/prescriptions");

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const prescriptionsData = await response.json();
      setRecords(prescriptionsData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching prescriptions:", error.message);
      setToast({
        show: true,
        message: "Failed to load prescriptions. Please try again later.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Filter records based on the search input
  const filteredRecords = records.filter((record) =>
    record.patientName.toLowerCase().includes(search.toLowerCase())
  );

  // Function to download a prescription as a PDF
  const handleDownloadPrescription = async (recordId) => {
    try {
      const element = document.querySelector(`#prescription-${recordId}`); // Target the specific prescription content
      const button = element.querySelector(".no-print"); // Select the button inside the prescription block

      // Temporarily hide the button
      button.style.display = "none";

      const canvas = await html2canvas(element, { scale: 2 }); // Higher scale for better quality
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Prescription_${recordId}.pdf`);

      // Restore the button visibility
      button.style.display = "block";
    } catch (error) {
      console.error("Error generating PDF:", error.message);
    }
  };

  // Styles for the page
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f8f9fa",
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: "900px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "black",
      textAlign: "center",
      marginBottom: "20px",
    },
    searchBar: {
      width: "40%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      outline: "none",
    },
    card: {
      width: "100%",
      maxWidth: "900px",
      background: "#fff",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      padding: "20px",
      marginTop: "20px",
    },
    recordItem: {
      background: "#fff",
      color: "#000",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      marginBottom: "15px",
    },
    recordHeader: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#007bff",
      marginBottom: "5px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#000",
    },
    actionButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "15px",
    },
    button: {
      padding: "8px 15px",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    downloadBtn: {
      background: "#48f0dc",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h2 style={styles.title}>Medical Records</h2>
        <input
          type="text"
          placeholder="Search by patient name..."
          style={styles.searchBar}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Records Section */}
      <div style={styles.card}>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record, index) => (
            <div
              key={index}
              id={`prescription-${record.id}`} // Add a unique ID for each prescription
              style={styles.recordItem}
            >
              <h3 style={styles.recordHeader}>
                Prescription for {record.patientName}
              </h3>
              <p>
                <strong>Prescription Date:</strong>{" "}
                {new Date(record.date).toLocaleDateString()}
              </p>
              <p style={styles.sectionTitle}>Medications</p>
              <ul>
                {record.medicines.map((med, i) => (
                  <li key={i}>
                    {med.name} ({med.dosage}, {med.frequency}, {med.duration})
                  </li>
                ))}
              </ul>
              <p>
                <strong>Age:</strong> {record.age}
              </p>
              <p>
                <strong>Diagnosis:</strong> {record.diagnosis}
              </p>
              <p>
                <strong>Surgeries:</strong> {record.surgeries || "None"}
              </p>
              <p>
                <strong>Follow-Up Date:</strong>{" "}
                {record.followUp?.nextDate
                  ? new Date(record.followUp.nextDate).toLocaleDateString()
                  : "None"}
              </p>
              <div style={styles.actionButtons}>
                <button
                  className="no-print"
                  style={{ ...styles.button, ...styles.downloadBtn }}
                  onClick={() => handleDownloadPrescription(record.id)}
                >
                  Download Prescription
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            No medical records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
