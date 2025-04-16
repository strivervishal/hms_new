import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User List</h2>
        {loading && <p style={styles.loading}>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && !error && users.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>Date of Birth</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>Blood Group</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={styles.row}>
                  <td style={styles.td}>{user.patient_fullName}</td>
                  <td style={styles.td}>{user.patient_gender}</td>
                  <td style={styles.td}>{new Date(user.patient_dob).toLocaleDateString()}</td>
                  <td style={styles.td}>{user.patient_phone}</td>
                  <td style={styles.td}>{user.patient_address}</td>
                  <td style={styles.td}>{user.patient_bloodGroup}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => navigate("/prescription")}
                    >
                      Add Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noRecords}>No user records found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    background: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    maxWidth: "1100px",
    width: "100%",
    background: "#fff",
    padding: "20px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  th: {
    background: "#48f0dc",
    color: "#333",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  },
  row: {
    transition: "background 0.3s",
  },
  button: {
    background: "#10B981",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "14px",
  },
  loading: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
    fontSize: "18px",
  },
  noRecords: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },
};

export default UserList;
