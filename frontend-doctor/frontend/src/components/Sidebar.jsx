import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaUserInjured,
  FaPills,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaUserCircle,
  FaBell,
  FaClock,
  FaFileInvoiceDollar,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="d-flex">
      {/* Toggle Button for Small Screens */}
      <button
        className="btn btn-light d-md-none position-fixed m-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`d-flex flex-column flex-shrink-0 p-3 bg-white shadow vh-100 position-fixed ${
          isOpen ? "d-block" : "d-none d-md-flex"
        }`}
        style={{ width: "230px" }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-4 text-decoration-none"
          style={{
            fontSize: "1.3rem",
            fontWeight: "500",
            letterSpacing: "0.5px",
          }}
        >
          <span className="me-2">🩺</span>
          <span style={{ color: "#45c4b5", fontWeight: "600" }}>You</span>
          <span style={{ color: "#000", fontWeight: "600" }}> Medi</span>
        </a>

        <ul className="nav nav-pills flex-column mb-auto">
          <SidebarItem to="/" icon={<FaHome />} label="Dashboard" />
          <SidebarItem
            to="/appointments"
            icon={<FaCalendarAlt />}
            label="Appointments"
          />
          <SidebarItem
            to="/patient"
            icon={<FaUserInjured />}
            label="Patients"
          />
          <SidebarItem
            to="/medicalrecords"
            icon={<FaClipboardList />}
            label="Medical Records"
          />

          <SidebarItem
            to="/doctors"
            icon={<FaUserMd />}
            label="Doctors"
          />

          <SidebarItem
            to="/availability"
            icon={<FaClock />}
            label="Availability & Scheduling"
          />
          <SidebarItem
            to="/billing"
            icon={<FaFileInvoiceDollar />}
            label="Billing & Payments"
          />
        </ul>

        <ul className="nav nav-pills flex-column mt-auto">
          <SidebarItem to="/profile" icon={<FaUserCircle />} label="Profile" />
          <SidebarItem to="/logout" icon={<FaSignOutAlt />} label="Logout" />
        </ul>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => {
  return (
    <li className="nav-item">
      <NavLink
        to={to}
        className="nav-link d-flex align-items-center text-dark fw-normal py-2 px-3 rounded"
        style={({ isActive }) =>
          isActive
            ? {
                backgroundColor: "#48f0dc",
                color: "#0B6E4F",
                fontWeight: "500",
                fontSize: "0.85rem",
              }
            : { color: "#4A4A4A", fontSize: "0.85rem" }
        }
      >
        <span className="me-3 fs-6">{icon}</span>
        {label}
      </NavLink>
    </li>
  );
};

export default Sidebar;