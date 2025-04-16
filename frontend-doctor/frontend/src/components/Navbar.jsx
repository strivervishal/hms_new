import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaUser } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();

  // Check if JWT token exists in local storage
  useEffect(() => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            fetchDoctorProfile(token);
        } else {
            setIsLoggedIn(false);
        }
    } catch (error) {
        console.error("Error reading token from localStorage:", error);
        setIsLoggedIn(false);
    }
}, []);


  // Fetch doctor details using JWT token
  const fetchDoctorProfile = async (token) => {
    if (!token) return; // Prevent API call if no token
    try {
      const res = await axios.get("http://localhost:5000/api/doctors/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoggedIn(true);
      setDoctorName(res.data.name || "Doctor");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoggedIn(false);
      localStorage.removeItem("token"); // Remove invalid token
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-white px-4 shadow-sm navbar-expand-lg">
      <div className="d-flex align-items-center w-100">
        <div className="input-group" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-light text-muted">
            <FaSearch />
          </span>
          <input type="text" className="form-control" placeholder="Search..." />
        </div>

        <div className="ms-auto d-flex align-items-center">
          {isLoggedIn ? (
            <>
              <button className="btn btn-light me-3">
                <FaBell className="fs-5 text-muted" />
              </button>

              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <FaUser className="fs-5 text-muted me-2" /> {doctorName}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/profile" data-bs-toggle="dropdown">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings" data-bs-toggle="dropdown">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn"
              style={{ color: "#0B6E4F", border: "1px solid #0B6E4F" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
