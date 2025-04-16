import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    availability: "",
    profileImage: null,
  });

  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [awards, setAwards] = useState([]);
  const [newAward, setNewAward] = useState({
    title: "",
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e, field) => {
    setDoctor({ ...doctor, [field]: e.target.files[0] });
  };

  const handleAchievementChange = (e) => {
    setNewAchievement({ ...newAchievement, [e.target.name]: e.target.value });
  };

  const handleAwardChange = (e) => {
    setNewAward({ ...newAward, [e.target.name]: e.target.value });
  };

  const handleAchievementImageUpload = (e) => {
    setNewAchievement({ ...newAchievement, image: e.target.files[0] });
  };

  const handleAwardImageUpload = (e) => {
    setNewAward({ ...newAward, image: e.target.files[0] });
  };

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement({ title: "", description: "", image: null });
    }
  };

  const addAward = () => {
    if (newAward.title && newAward.description) {
      setAwards([...awards, newAward]);
      setNewAward({ title: "", description: "", image: null });
    }
  };

  const uploadProfile = async () => {
    const formData = new FormData();
    formData.append("name", doctor.name);
    formData.append("email", doctor.email);
    formData.append("phone", doctor.phone);
    formData.append("password", doctor.password);
    formData.append("specialization", doctor.specialization);
    formData.append("availability", doctor.availability);
    if (doctor.profileImage) {
      formData.append("doctor[profileImage]", doctor.profileImage);

    }

    achievements.forEach((ach, index) => {
      formData.append(`achievements[${index}][title]`, ach.title);
      formData.append(`achievements[${index}][description]`, ach.description);
      if (ach.image) {
        formData.append(`achievements[${index}][image]`, ach.image);
      }
    });

    awards.forEach((award, index) => {
      formData.append(`awards[${index}][title]`, award.title);
      formData.append(`awards[${index}][description]`, award.description);
      if (award.image) {
        formData.append(`awards[${index}][image]`, award.image);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/doctors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(" Doctor Profile uploaded successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error uploading profile", error);
      alert("Failed to upload profile");
    }
  };

  const styles = {
    container: {
      width: "60%",
      margin: "auto",
      padding: "20px",
      background: "white",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
    },
    inputField: {
      width: "100%",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "16px",
    },
    button: {
      background: "#45c4b5",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "0.3s",
      marginTop: "10px",
    },
    buttonHover: {
      background: "#3aa89e",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Add New Doctor</h2>
      <input style={styles.inputField} type="text" name="name" placeholder="Name" value={doctor.name} onChange={handleInputChange} />
      <input style={styles.inputField} type="email" name="email" placeholder="Email" value={doctor.email} onChange={handleInputChange} />
      <input style={styles.inputField} type="password" name="password" placeholder="Password" value={doctor.password} onChange={handleInputChange} />
      <input style={styles.inputField} type="text" name="phone" placeholder="Phone" value={doctor.phone} onChange={handleInputChange} />
      <input style={styles.inputField} type="text" name="specialization" placeholder="Specialization" value={doctor.specialization} onChange={handleInputChange} />
      <input style={styles.inputField} type="text" name="availability" placeholder="Availability" value={doctor.availability} onChange={handleInputChange} />
      <input style={styles.inputField} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "profileImage")} />

      <h3>Achievements</h3>
      <input style={styles.inputField} type="text" name="title" placeholder="Achievement Title" value={newAchievement.title} onChange={handleAchievementChange} />
      <textarea style={styles.inputField} name="description" placeholder="Description" value={newAchievement.description} onChange={handleAchievementChange}></textarea>
      <input style={styles.inputField} type="file" accept="image/*" onChange={handleAchievementImageUpload} />
      <button style={styles.button} onClick={addAchievement}>Add Achievement</button>

      <h3>Awards</h3>
      <input style={styles.inputField} type="text" name="title" placeholder="Award Title" value={newAward.title} onChange={handleAwardChange} />
      <textarea style={styles.inputField} name="description" placeholder="Description" value={newAward.description} onChange={handleAwardChange}></textarea>
      <input style={styles.inputField} type="file" accept="image/*" onChange={handleAwardImageUpload} />
      <button style={styles.button} onClick={addAward}>Add Award</button>

      <button style={styles.button} onClick={uploadProfile}>Save Profile</button>
    </div>
  );
}

export default Doctors;
