import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "../styles/global.css";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const BASE_URL = 'http://localhost:5000';

const PatientLogin = () => {
  const [formData, setFormData] = useState({ patient_username: "", patient_password: "" });
  const [user, setUser] = useState(null); // State to store user profile
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/patientLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_email: formData.patient_username,
          patient_password: formData.patient_password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId); // Store userId in localStorage
        const profileResponse = await fetch(`${BASE_URL}/api/auth/getPatientProfile`, {
          headers: { Authorization: `Bearer ${result.token}` },
        });
        const profile = await profileResponse.json();
        setUser(profile); // Assuming `setUser` updates the global user state
        toast.success('Login successful', { position: "top-right" });
        setFormData({ patient_username: "", patient_password: "" });
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to the dashboard page
        }, 1000); 
      } else {
        toast.error(result.message || 'Login failed', { position: "top-right" });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Something went wrong!', { position: "top-right" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patient_username || !formData.patient_password) {
      toast.error("Please enter username and password!", { position: "top-right" });
      return;
    }
    handleLogin();
  };

  return (
    <>
      <div className="h-screen w-full bg-[#E6F8F7] flex justify-center items-center">
        <div className="p-12 max-w-2xl w-fit h-[400px] bg-white shadow-md rounded-xl border border-[#66D2CE] flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#66D2CE] mb-4 flex items-center justify-center">
            <User className="w-6 h-6 mr-2" />Patient Login
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center">
            <div className="mb-4 flex items-center bg-white shadow rounded-lg border border-[#66D2CE] p-2">
              <User className="text-[#66D2CE] w-5 h-5 mx-2" />
              <input
                name="patient_username"
                type="text"
                placeholder="email"
                onChange={handleChange}
                value={formData.patient_username}
                className="w-full p-2 focus:outline-none bg-white text-black placeholder-gray-500" // Ensure white background and black text
              />
            </div>

            <div className="mb-4 flex items-center bg-white shadow rounded-lg border border-[#66D2CE] p-2">
              <Lock className="text-[#66D2CE] w-5 h-5 mx-2" />
              <input
                name="patient_password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.patient_password}
                className="w-full p-2 focus:outline-none bg-white text-black placeholder-gray-500" // Ensure white background and black text
              />
            </div>

            <button type="submit" className="px-4 py-2 text-white bg-[#66D2CE] rounded hover:bg-[#4ab7b3] transition duration-200 w-full">
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-gray-700">Don't have an account? </span> {/* Changed text color to gray-700 */}
            <Link to="/register" className="text-[#66D2CE] hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PatientLogin;
