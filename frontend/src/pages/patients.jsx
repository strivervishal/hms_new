import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaFileMedical, FaUserPlus } from "react-icons/fa";

const Patients = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      padding: "20px",
      background: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      minHeight: "100vh",
      alignItems: "center",
      flexDirection: "column",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "12px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#48f0dc",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.3s, transform 0.2s",
      width: "250px",
    },
    buttonHover: {
      backgroundColor: "#36c9b7",
      transform: "scale(1.05)",
    },
  };

  return (
    <div style={styles.container}>
      <h2 className="text-primary">Patients Management</h2>
      
      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        onClick={() => navigate("/userlist")}
      >
        <FaUsers /> Patient List
      </button>

      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        onClick={() => navigate("/medicalrecords")}
      >
        <FaFileMedical /> Medical Records
      </button>
    </div>
  );
};

export default Patients;
