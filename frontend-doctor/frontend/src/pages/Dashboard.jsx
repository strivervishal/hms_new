import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching patients:", error));

    axios.get("http://localhost:5000/api/appointments")
      .then(response => setAppointments(response.data))
      .catch(error => console.error("Error fetching appointments:", error));
  }, []);

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Hospitalized Patients",
        data: [120, 150, 130, 180, 160, 200],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
      },
      {
        label: "Outpatients",
        data: [100, 130, 98, 140, 150, 170],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
      },
    ],
  };

  return (
    <Container fluid style={styles.container}>
      <Row className="mb-4" style={styles.headerRow}>
        <Col md={6}>
          <h4 style={styles.greeting}>Good Morning Dr. Robert!</h4>
        </Col>
        <Col md={6}>
          <h4 style={styles.heading}>Dashboard</h4>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row>
        {[
          { title: "Total Patients", value: users.length, change: "+15%", route: "/userlist" },
          { title: "Total Appointments", value: appointments.length, change: "+10%", route: "/appointments" },
          { title: "Total Income", value: "$8,399.24", change: "+28%" },
          { title: "Total Treatments", value: "112", change: "+12%" },
        ].map((item, idx) => (
          <Col key={idx} md={3}>
            <Card 
              style={styles.statCard} 
              onClick={() => item.route && navigate(item.route)} // Navigate on click
            >
              <h6>{item.title}</h6>
              <h4>{item.value}</h4>
              <span style={styles.greenText}>{item.change}</span>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Overview & Appointments */}
      <Row className="mt-4">
        <Col md={8}>
          <Card style={styles.card}>
            <h5>Overview</h5>
            <Line data={chartData} />
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.card}>
            <h5>Appointment List</h5>
            <Table borderless>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 4).map((appt, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td>{appt.firstName}</td>
                    <td>{appt.mobile}</td>
                    <td>{appt.gender}</td>
                    <td>{appt.time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* Patient List */}
      <Row className="mt-4">
        <Col>
          <Card style={styles.card}>
            <h5>Patient List</h5>
            <Table striped bordered>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Contact</th>
                  <th>Blood Group</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user, idx) => (
                  <tr key={idx} style={styles.tableRow}>
                    <td>{user.patient_fullName}</td>
                    <td>{user.patient_gender}</td>
                    <td>{user.patient_address}</td>
                    <td>{user.patient_phone}</td>
                    <td>{user.patient_bloodGroup}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Internal CSS Styles
const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    minHeight: "100vh",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
  },
  heading: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "right",
  },
  statCard: {
    padding: "15px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    cursor: "pointer", // Indicate clickable action
    transition: "background 0.3s",
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
  },
  tableRow: {
    transition: "background 0.3s",
  },
};

export default Dashboard;
