import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments/all")
      .then((res) => res.json())
      .then((data) => setAppointments(data.appointments))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/cancel/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to cancel appointment");
        }

        setAppointments(appointments.filter((appt) => appt._id !== id));
        alert("Appointment canceled successfully!");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleReschedule = (appointment) => {
    navigate("/appointments", { state: { appointment } });
  };

  const today = new Date();
  const upcomingAppointments = appointments.filter((appt) => new Date(appt.date) >= today);
  const pastAppointments = appointments.filter((appt) => new Date(appt.date) < today);
  const displayedAppointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto"> {/* Increased max-width for a wider layout */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Appointments</h2>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/doctor-availability")}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            Doctor Availability
          </button>
          
          <button
            onClick={() => navigate("/appointments")}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
          >
            + New Appointment
          </button>
        </div>
      </div>


      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 text-sm font-medium ${activeTab === "upcoming" ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 text-sm font-medium ${activeTab === "past" ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400" : "text-gray-500 dark:text-gray-400"}`}
        >
          Past
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="px-8 py-4">Doctor</th>
              <th className="px-8 py-4">Date & Time</th>
              <th className="px-8 py-4">Notes</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedAppointments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No {activeTab === "upcoming" ? "upcoming" : "past"} appointments found.
                </td>
              </tr>
            ) : (
              displayedAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="px-8 py-4 flex items-center space-x-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-teal-500 text-white rounded-full font-bold">
                      {appointment.doctor.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{appointment.doctor}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.department}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(appointment.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">{appointment.time}</p>
                  </td>
                  <td className="px-8 py-4 text-gray-700 dark:text-gray-300">{appointment.notes || "-"}</td>
                  <td className="px-8 py-4 text-right">
                    {activeTab === "upcoming" ? (
                      <>
                        <button
                          onClick={() => handleReschedule(appointment)}
                          className="text-teal-500 dark:text-teal-400 hover:underline mr-4"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="text-red-500 dark:text-red-400 hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          navigate("/appointments", {
                            state: {
                              appointment: {
                                ...appointment,
                                date: "", // Clear the date
                                time: "", // Clear the time
                              },
                            },
                          })
                        }
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        Book Again
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAppointments;
