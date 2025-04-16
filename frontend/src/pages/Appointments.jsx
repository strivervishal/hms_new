import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/appointments");
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch appointments");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAddPrescription = () => {
    navigate("/prescription");
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f8f9fa",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "1000px",
      padding: "20px",
      background: "#fff",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    th: {
      background: "#48f0dc",
      color: "white",
      padding: "12px",
      textAlign: "left",
      border: "1px solid #ddd",
    },
    td: {
      padding: "12px",
      border: "1px solid #ddd",
      textAlign: "center",
    },
    button: {
      background: "#007bff",
      color: "white",
      border: "none",
      padding: "8px 12px",
      cursor: "pointer",
      borderRadius: "5px",
      transition: "background 0.3s",
    },
    buttonHover: {
      background: "#0056b3",
    },
    title: {
      textAlign: "center",
      color: "black",
      marginBottom: "20px",
      fontSize: "22px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Appointments List</h2>
        {loading && <p style={{ textAlign: "center", fontWeight: "bold" }}>Loading...</p>}
        {error && <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>{error}</p>}
        {!loading && !error && appointments.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td style={styles.td}>{appointment.firstName} {appointment.lastName}</td>
                  <td style={styles.td}>{appointment.mobile}</td>
                  <td style={styles.td}>{appointment.email}</td>
                  <td style={styles.td}>{appointment.date}</td>
                  <td style={styles.td}>{appointment.time}</td>
                  <td style={styles.td}>{appointment.doctor}</td>
                  <td style={styles.td}>{appointment.department}</td>
                  <td style={styles.td}>
                    <button 
                      style={styles.button} 
                      onMouseOver={(e) => e.target.style.background = styles.buttonHover.background}
                      onMouseOut={(e) => e.target.style.background = styles.button.background}
                      onClick={handleAddPrescription}
                    >
                      Add Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Appointments;