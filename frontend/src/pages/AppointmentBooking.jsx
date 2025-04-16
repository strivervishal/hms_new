import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    gender: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    if (location.state?.appointment) {
      // Pre-fill the form with the passed data (except date and time)
      const { date, time, ...rest } = location.state.appointment;
      setFormData((prev) => ({ ...prev, ...rest }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = location.state?.appointment?.booked
      ? `http://localhost:5000/api/appointments/reschedule/${location.state.appointment._id}`
      : "http://localhost:5000/api/appointments/book";

    const method = location.state?.appointment?.booked ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      alert(location.state?.appointment?.booked ? "Rescheduled Successfully!" : "Booked Successfully!");
      navigate("/my-appointments");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="px-6 py-4 mt-16">
      <div className="max-w-lg mx-auto p-6 rounded-xl shadow-xl transition-all border-2 bg-white text-gray-900 border-[#64CCC5]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {location.state?.appointment?.booked ? "Reschedule Appointment" : "Book an Appointment"}
          </h2>
          <button
            onClick={() => navigate("/my-appointments")}
            className="bg-[#64CCC5] hover:bg-[#4DA9A5] text-white font-semibold py-1 px-2 rounded-md text-xs"
          >
            My Appointments
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium">Appointment Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Appointment Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
                required
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
              className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
              required
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium">Doctor</label>
            <input
              type="text"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              placeholder="Doctor"
              className="border-2 border-[#64CCC5] p-2 rounded-lg w-full text-sm shadow-md bg-white text-gray-900"
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#64CCC5] hover:bg-[#4DA9A5] text-white font-bold py-2 px-3 rounded-lg text-sm mt-4 shadow-lg">
            {location.state?.appointment?.booked ? "Reschedule Appointment" : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
