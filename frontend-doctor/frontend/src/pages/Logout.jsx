import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token"); // Get token from storage

            if (!token) {
                console.error("No token found, redirecting to login.");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/doctors/logout",  // Ensure correct route name
                {}, // Empty request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Send token in headers
                    },
                }
            );

            console.log(response.data.message);

            localStorage.removeItem("token"); // Remove token after logout
            navigate("/login"); // Redirect to login page

        } catch (error) {
            console.error("Logout failed:", error.response ? error.response.data : error.message);
            if (error.response?.status === 401) {
                localStorage.removeItem("token"); // Remove invalid token
                navigate("/login");
            }
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
