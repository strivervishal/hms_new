import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import PatientDetail from "./pages/PatientDetail";
import Patients from "./pages/patients";
import Appointments from "./pages/Appointments";
import MedicalRecords from "./pages/MedicalRecords";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import Availability from "./pages/Availability";
import Notifications from "./pages/Notifications";
import Doctors from "./pages/Doctors";
import PrescriptionPage from "./pages/PrescriptionPage";
import "bootstrap/dist/css/bootstrap.min.css";
import UserList from "./pages/UserList";





const App = () => {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: "250px" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/profile/:email" element={<Profile />} />
          <Route path="/patient" element={<Patients/>}/>
          <Route path="/patientdetail" element={<PatientDetail/>}/>
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/userlist" element={<UserList/>}/>
          <Route path="/doctors" element={<Doctors/>}/>
          <Route path="/appointments" element={<Appointments/>}/>
          <Route path="/medicalrecords" element={<MedicalRecords/>}/>
          <Route path="/medicalrecords/:id" element={<MedicalRecords />} />
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/billing" element={<Billing/>}/>
          <Route path="/availability" element={<Availability/>}/>
          <Route path="/notifications" element={<Notifications/>}/> 
          <Route path="/prescription" element={<PrescriptionPage/>}/>
          <Route path="/navbar" element={<Navbar/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;