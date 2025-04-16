import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Auth Token:", token); // Debugging


  {/*
    if (!token) {
      console.error("No token found in localStorage");
      navigate("/login");
      return;
    }*/}
  
    axios
      .get(`http://localhost:5000/api/doctors/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setDoctor(response.data))
      .catch((error) => {
        console.error("Error fetching profile:", error);
        navigate("/login");
      });
  }, []);
  
  

  if (!doctor) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Welcome, {doctor.name}</h2>
      <p>Email: {doctor.email}</p>
      <p>Specialization: {doctor.specialization}</p>
      <p>Phone: {doctor.phone}</p>
      <p>Availability: {doctor.availability}</p>
      {doctor.profileImage && (
        <img
          src={`http://localhost:5000/${doctor.profileImage}`}
          alt="Profile"
          width="150"
        />
      )}
    </div>
  );
};

export default Profile;
