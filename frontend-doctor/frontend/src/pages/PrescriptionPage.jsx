import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const PrescriptionPage = () => {
  const [formData, setFormData] = useState({
    date: "",
    patientName: "",
    age: "",
    diagnosis: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "", notes: "" }],
    surgeries: "",
    followUp: { nextDate: "", nextNotes: "" },
  });

  const handleChange = (e, index = null, field = null, type = "general") => {
    if (type === "medicines") {
      const updatedMedicines = [...formData.medicines];
      updatedMedicines[index][field] = e.target.value;
      setFormData({ ...formData, medicines: updatedMedicines });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: "", dosage: "", frequency: "", duration: "", notes: "" }],
    });
  };

  const removeMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/doctors/add/prescription", formData);
      setFormData({
        date: "",
        patientName: "",
        age: "",
        diagnosis: "",
        medicines: [{ name: "", dosage: "", frequency: "", duration: "", notes: "" }],
        surgeries: "",
        followUp: { nextDate: "", nextNotes: "" },
      });
      alert("Prescription Added Successfully");
    } catch (error) {
      console.error("Error adding prescription", error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#f8f9fa",
      overflow: "auto",
      padding: "20px",
    },
    card: {
      width: "80%",
      maxWidth: "800px",
      padding: "20px",
      background: "#fff",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
    },
    button: {
      backgroundColor: "#48f0dc",
      color: "white",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
      width: "100%",
      margin: "5px 0",
    },
    deleteButton: {
      backgroundColor: "#ff4d4d",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer",
      color: "white",
      marginLeft: "10px",
    },
    inputField: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 className="text-center text-primary">Add Prescription</h2>
        <form onSubmit={handleSubmit}>
          <label>Date of Prescription</label>
          <input type="date" name="date" style={styles.inputField} onChange={handleChange} required />

          <label>Patient Name</label>
          <input type="text" name="patientName" style={styles.inputField} placeholder="Enter patient name" onChange={handleChange} required />

          <label>Age</label>
          <input type="number" name="age" style={styles.inputField} placeholder="Enter age" onChange={handleChange} required />

          <label>Diagnosis</label>
          <input type="text" name="diagnosis" style={styles.inputField} placeholder="Enter diagnosis" onChange={handleChange} required />

          <h4>Medications</h4>
          {formData.medicines.map((medicine, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input type="text" placeholder="Medicine Name (e.g., Paracetamol)" style={styles.inputField} value={medicine.name} onChange={(e) => handleChange(e, index, "name", "medicines")} required />
              <input type="text" placeholder="Dosage (e.g., 500 mg)" style={styles.inputField} value={medicine.dosage} onChange={(e) => handleChange(e, index, "dosage", "medicines")} required />
              <input type="text" placeholder="Frequency (e.g., Twice a day)" style={styles.inputField} value={medicine.frequency} onChange={(e) => handleChange(e, index, "frequency", "medicines")} required />
              <input type="text" placeholder="Duration (e.g., 5 days)" style={styles.inputField} value={medicine.duration} onChange={(e) => handleChange(e, index, "duration", "medicines")} required />
              <input type="text" placeholder="Notes (e.g., Take after food)" style={styles.inputField} value={medicine.notes} onChange={(e) => handleChange(e, index, "notes", "medicines")} />
              <button style={styles.deleteButton} onClick={() => removeMedicine(index)}><FaTrash /></button>
            </div>
          ))}
          <button type="button" style={styles.button} onClick={addMedicine}><FaPlus /> Add Medicine</button>

          <h4>Surgeries / Operations</h4>
          <input type="text" name="surgeries" placeholder="Enter past surgeries or operations" style={styles.inputField} onChange={handleChange} />

          <h4>Follow-Up</h4>
          <label>Next Consultation Date</label>
          <input type="date" name="followUpDate" style={styles.inputField} onChange={handleChange} />

          <label>Doctor Notes for Next Visit</label>
          <textarea name="followUpNotes" placeholder="Enter follow-up notes" style={styles.inputField} onChange={handleChange}></textarea>

          <button type="submit" style={styles.button}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionPage;