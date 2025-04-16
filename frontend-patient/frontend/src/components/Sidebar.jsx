import { NavLink } from 'react-router-dom'
import { 
  FaHome, 
  FaCalendarAlt, 
  FaHistory, 
  FaPrescriptionBottleAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaComments
} from 'react-icons/fa'

const SidebarIcon = ({ icon, text, to }) => (
  <NavLink to={to} className={({ isActive }) => 
    `sidebar-icon group ${isActive ? 'bg-primary text-white' : ''}`
  }>
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </NavLink>
)

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-20 m-0 flex flex-col bg-white dark:bg-dark text-dark dark:text-white shadow-lg z-10">
      <div className="flex items-center justify-center h-14 w-full mt-2"> {/* Added margin-top */}
        <a
          href="/"
          className="d-flex align-items-center mb-4 text-decoration-none"
          style={{
            fontSize: "1rem", // Reduced font size
            fontWeight: "500",
            letterSpacing: "0.3px", // Reduced letter spacing
          }}
        >
          <span className="me-0.5">🩺</span> {/* Reduced spacing */}
          <span style={{ color: "#45c4b5", fontWeight: "600" }}>Your</span>
          <span style={{ color: "#000", fontWeight: "600" }}> Medico</span>
        </a>
      </div>
      <div className="flex flex-col items-center">
        <SidebarIcon icon={<FaHome size="20" />} text="Dashboard" to="/dashboard" />
        <SidebarIcon icon={<FaCalendarAlt size="20" />} text="Appointments" to="/my-appointments" />
        <SidebarIcon icon={<FaPrescriptionBottleAlt size="20" />} text="Prescriptions" to="/prescriptions" />
        <SidebarIcon icon={<FaFileInvoiceDollar size="20" />} text="Billing" to="/billing" />
        <SidebarIcon icon={<FaUser size="20" />} text="Profile" to="/profile" />
      </div>

      <div className="sidebar-icon group">
        <NavLink to="/">
          <FaSignOutAlt size="20" />
          <span className="sidebar-tooltip group-hover:scale-100">
            Log Out
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;