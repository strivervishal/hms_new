import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import useUserStore from './stores/userStore';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

import Prescriptions from './pages/Prescriptions';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import PatientLogin from './pages/PatientLogin';
import PatientRegistration from './pages/PatientRegistration';

import AppointmentBooking from './pages/AppointmentBooking';
import MyAppointments from './pages/MyAppointments';
import DoctorAvailability from './components/DoctorAvailability';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { fetchUser, fetchUpcomingAppointments } = useUserStore();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId && token) {
      fetchUser(userId, token).catch((err) => {
        console.error('Error fetching user:', err.message);
      });

      fetchUpcomingAppointments(token).catch((err) => {
        console.error('Error fetching appointments:', err.message);
      });
    }
  }, [fetchUser, fetchUpcomingAppointments]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </Router>
  );
}

function AppContent({ darkMode, toggleDarkMode }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isRegistrationPage = location.pathname === '/register';

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {!isLoginPage && !isRegistrationPage && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isLoginPage && !isRegistrationPage && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        <main className="flex-1 overflow-y-auto bg-neutral-lightest dark:bg-dark-dark p-4">
          <Routes>
            <Route path="/" element={<PatientLogin />} />
            <Route path="/register" element={<PatientRegistration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<AppointmentBooking darkMode={darkMode} />} />
            <Route path="/my-appointments" element={<MyAppointments darkMode={darkMode} />} />
            <Route path="/doctor-availability" element={<DoctorAvailability />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
