import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/patients/${id}`)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error("Error fetching patient:", error));
  }, [id]);

  if (!patient) return <h2 style={{ textAlign: "center", color: "#007bff" }}>Loading...</h2>;

  // Internal CSS styles
  const styles = {
    container: {
      width: "60%",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "white",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      textAlign: "center",
    },
    title: {
      color: "black",
      marginBottom: "20px",
    },
    detailText: {
      fontSize: "18px",
      marginBottom: "10px",
      color: "#333",
    },
    strongText: {
      fontWeight: "bold",
      color: "#007bff",
    },
    button: {
      backgroundColor: "#48f0dc",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "0.3s",
      marginTop: "20px",
    },
    buttonHover: {
      backgroundColor: "#40d9c7",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{patient.name}</h2>
      <p style={styles.detailText}>
        <strong style={styles.strongText}>Gender:</strong> {patient.gender}
      </p>
      <p style={styles.detailText}>
        <strong style={styles.strongText}>Date of Birth:</strong> {patient.dateOfBirth}
      </p>
      <p style={styles.detailText}>
        <strong style={styles.strongText}>Contact:</strong> {patient.contact || "N/A"}
      </p>
      <p style={styles.detailText}>
        <strong style={styles.strongText}>Address:</strong> {patient.address || "N/A"}
      </p>
      <p style={styles.detailText}>
        <strong style={styles.strongText}>Blood Group:</strong> {patient.bloodGroup || "N/A"}
      </p>
      <p style={styles.detailText}>
        <strong style={styles.strongText}>Medical History:</strong> {patient.medicalHistory || "N/A"}
      </p>
      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        onClick={() => navigate('/prescription')}
      >
        Add Prescription
      </button>
    </div>
  );
};

export default PatientDetail;
