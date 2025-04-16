import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Availability = () => {
  const [doctorName, setDoctorName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("10:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");
  const [timeSlots, setTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [doctorList, setDoctorList] = useState([]);

  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctors");
        const data = response.data;
        if (Array.isArray(data)) {
          setDoctorList(data);
        } else {
          console.error("Invalid doctor list format:", data);
        }
      } catch (error) {
        console.error("Error fetching doctor list:", error);
      }
    };
    fetchDoctorList();
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    // Generate AM times first, then PM times
    for (let hour = 1; hour <= 12; hour++) {
      ["00", "30"].forEach((minute) => {
        times.push(`${hour}:${minute} AM`);
      });
    }
    for (let hour = 1; hour <= 12; hour++) {
      ["00", "30"].forEach((minute) => {
        times.push(`${hour}:${minute} PM`);
      });
    }
    return times;
  };

  const convertTo24HourFormat = (time) => {
    let [hour, minute, period] = time.split(/[: ]/);
    hour = parseInt(hour);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return new Date(2023, 0, 1, hour, minute);
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${period}`;
  };

  const generateTimeSlots = () => {
    if (!doctorName || !selectedDate || !startTime || !endTime) {
      alert("Please select a doctor, date, and working hours.");
      return;
    }

    const start = convertTo24HourFormat(startTime);
    const end = convertTo24HourFormat(endTime);

    // Ensure the end time is after the start time
    if (start >= end) {
      alert("End time must be greater than start time.");
      return;
    }

    const slotTimes = [];
    while (start < end) {
      let nextSlot = new Date(start.getTime() + 30 * 60000);
      slotTimes.push({
        time: formatTime(start) + " - " + formatTime(nextSlot),
        available: false,
      });
      start.setMinutes(start.getMinutes() + 30);
    }

    setTimeSlots(slotTimes);
    setAvailability({});
  };

  const toggleAvailability = (slot) => {
    setAvailability((prev) => ({
      ...prev,
      [slot]: !prev[slot],
    }));
  };

  const saveAvailability = async () => {
    const availableSlots = Object.keys(availability).filter(
      (slot) => availability[slot]
    );

    console.log("Saving availability with data:", {
      doctorName,
      date: selectedDate,
      availableSlots,
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/availability",
        {
          doctorName,
          date: selectedDate,
          availableSlots,
        }
      );
      console.log("Response from server:", response.data);
      alert("Availability saved successfully!");

      // Reset all states to their initial values
      setDoctorName("");
      setSelectedDate("");
      setStartTime("10:00 AM");
      setEndTime("5:00 PM");
      setTimeSlots([]);
      setAvailability({});
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Error saving availability.");
    }
  };

  return (
    <div className="container mt-5">
      <style>
        {`
          .dashboard-title {
            font-size: 2rem; 
            font-weight: bold;
            color: #2c3e50; 
            text-align: center;
            margin-bottom: 20px; 
            font-family: 'Arial', sans-serif; 
            text-transform: uppercase; 
            letter-spacing: 1.5px; 
          }

          .form {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            max-width: 400px; 
            margin: 50px auto; 
            padding: 20px;
            background: #ffffff;
            border-radius: 10px;
            border: 1px solid black;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          }

          .input-group {
            margin-bottom: 15px;
          }

          .input-label {
            display: block;
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 8px;
            color: #4a4a4a;
            margin-right: 15px;
          }

          .input-field {
            font-size: 1rem;
            border: 1px solid grey;
          }

          .time-slot-heading {
            font-size: 2rem; 
            font-weight: bold;
            color: #2c3e50; 
            text-align: center;
            margin-bottom: 20px; 
            font-family: 'Arial', sans-serif; 
            text-transform: uppercase; 
            letter-spacing: 1.5px; 
          }

          .slot-card {
            display: inline-block;
            width: 100%;
            max-width: 250px;
            margin: 10px;
            padding: 15px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .slot-card.available {
            background: #45c4b5; /* Teal */
            color: rgb(242, 242, 242); /* Dark Green */
          }

          .slot-card.unavailable {
            background: #f8d7da;
            color: #721c24;
          }

          .status {
            font-size: 14px;
            font-weight: bold;
          }

          .button-container {
            display: flex;
            justify-content: center;
            gap: 10px; 
          }

          .generate-btn, .save-btn {
            width: auto;
            background-color: #48f0dc;
            font-size: 14px;
            padding: 6px 12px;
            margin-bottom: 20px;
          }

          .generate-btn:hover, .save-btn:hover {
            background-color: #45c4b5; /* Slightly darker shade */
            border-color: #45c4b5;
          }

          .time-slots {
            padding: 20px;
            margin-left: 70px;
          }

          /* Custom Styling to Reduce Input Field Size */
          .form-control-sm {
            font-size: 0.9rem;
            padding: 0.375rem 0.75rem;
          }
        `}
      </style>

      <h2 className="dashboard-title">Doctor Availability Status</h2>

      {/* Doctor Dropdown */}
      <div className="form">
        <div className="input-group">
          <label className="input-label">Doctor Name:</label>
          <select
            className="input-field form-control-md"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
          >
            <option value="" disabled>
              Select Doctor
            </option>
            {doctorList.map((doctor) => (
              <option key={doctor._id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Select Date */}
        <div className="input-group">
          <label className="input-label">Select Date:</label>
          <input
            className="input-field form-control-md"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} 
          />
        </div>

        {/* Select Working Hours */}
        <div className="row">
          <div className="col-md-6">
            <div className="input-group">
              <label className="input-label">Start Time:</label>
              <select
                className="input-field form-control-md"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group">
              <label className="input-label">End Time:</label>
              <select
                className="input-field form-control-md"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="btn btn-md generate-btn" onClick={generateTimeSlots}>
          Generate Time Slots
        </button>
      </div>

      {timeSlots.length > 0 && (
        <div className="time-slots">
          <h3 className="time-slot-heading">
            Time Slots for {doctorName} on {selectedDate}
          </h3>

          <div className="d-flex flex-wrap justify-content-start">
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                className={`slot-card ${
                  availability[slot.time] ? "available" : "unavailable"
                }`}
                onClick={() => toggleAvailability(slot.time)}
              >
                <span>{slot.time}</span>
                <div className="status">
                  {availability[slot.time] ? "Available" : "Unavailable"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="button-container">
        <button className="btn btn-md save-btn" onClick={saveAvailability}>
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default Availability;
