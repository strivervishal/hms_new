import { useState, useEffect } from "react";

const DoctorAvailability = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDate, setSelectedDate] = useState(""); // Store selected date
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDoctors = async () => {
        if (!selectedDate) return; // Ensure a date is selected

        try {
            setLoading(true);
            setError(null);

            // Fetch doctors and their available slots for the selected date
            const response = await fetch(`http://localhost:5000/api/doctors?date=${selectedDate}`);
            if (!response.ok) {
                throw new Error("Failed to fetch doctors");
            }
            const data = await response.json();
            console.log("Fetched Doctors with Slots:", data);

            setDoctors(data);
        } catch (err) {
            console.error("Error fetching doctors:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ml-16 container mx-auto p-6"> {/* Added `ml-16` to account for the sidebar width */}
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Doctor Availabilities</h2>

            {/* Date Picker */}
            <div className="mb-4 flex justify-center">
                <input
                    type="date"
                    className="border p-2 rounded-md"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                    onClick={fetchDoctors}
                    className="ml-4 bg-[#4DA9A5] hover:bg-[#3B8C86] text-white px-4 py-2 rounded-md"
                >
                    Check Availability
                </button>
            </div>

            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                        <p className="text-gray-600"><strong>Specialization:</strong> {doctor.specialization}</p>

                        <h4 className="mt-4 font-semibold text-gray-700">Available Slots ({selectedDate}):</h4>
                        {doctor.availableSlots.length > 0 ? (
                            <ul className="mt-2">
                                {doctor.availableSlots.map((slot, index) => (
                                    <li 
                                        key={index} 
                                        className="text-white font-medium bg-[#4DA9A5] px-3 py-1 rounded-md inline-block mr-2 mb-2"
                                    >
                                        {slot}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-2">No slots available</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorAvailability;
