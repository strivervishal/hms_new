// filepath: e:\Patient_Dashboard\Patient_dashboard_new\frontend\src\stores\userStore.js
async function fetchUpcomingAppointments() {
  try {
    const response = await fetch('/api/appointments/upcoming');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}

import { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaMoon, FaSun } from 'react-icons/fa';
import useUserStore from '../stores/userStore';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="h-16 px-4 flex items-center justify-between bg-white dark:bg-dark border-b border-neutral dark:border-dark-light">
      <div className="flex items-center ml-16">
        <h1 className="text-xl font-semibold text-dark-dark dark:text-white ml-4">
          Patient Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <FaBell
            className="text-dark-dark dark:text-white cursor-pointer"
            size={20}
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-sm font-semibold text-dark-dark dark:text-white mb-2">Notifications</h3>
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li key={notification.id} className="text-sm text-neutral-darkest dark:text-neutral-light">
                    {notification.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user?.patient_fullName
              ?.split(' ')
              .map((name) => name[0])
              .join('')
              .toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-dark-dark dark:text-white">
              {user?.patient_fullName || 'User'}
            </p>
            <p className="text-xs text-neutral-darkest dark:text-neutral-light">
              Patient
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;