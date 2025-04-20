import { useState, useCallback, useRef } from "react";
import { User, Phone, Mail, Home, Eye, HeartPulse, FileText, ChevronLeft, ChevronRight, AlertTriangle, Upload } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const BASE_URL ='http://localhost:5000';

const Input = ({ label, name, type = "text", icon: Icon, value, onChange }) => {
  return (
    <div className="mb-4 flex items-center bg-white shadow rounded-lg border border-[#66D2CE] p-3">
      <Icon className="text-[#66D2CE] w-5 h-5 mx-3" />
      <input
        name={name}
        type={type}
        placeholder={label}
        onChange={onChange}
        value={value}
        className="w-full p-2 focus:outline-none bg-white text-black" // Ensure background color is white and text color is black
      />
    </div>
  );
};

const Dropdown = ({ label, name, options, value, onChange, icon: Icon }) => {
  return (
    <div className="mb-4 flex items-center bg-white shadow rounded-lg border border-[#66D2CE] p-3">
      <Icon className="text-[#66D2CE] w-5 h-5 mx-3" />
      <select name={name} value={value} onChange={onChange} className="w-full p-2 focus:outline-none bg-white text-black"> {/* Ensure background color is white and text color is black */}
        <option value="">{label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white bg-[#66D2CE] rounded hover:bg-[#4ab7b3] transition duration-200 flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  );
};

const PatientRegistration = () => {
  const [submitCount, setSubmitCount] = useState(0);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patient_fullName: "",
    patient_dob: "",
    patient_gender: "",
    patient_bloodGroup: "",
    patient_maritalStatus: "",
    patient_phone: "",
    patient_email: "",
    patient_password: "",
    patient_address: "",
    patient_emergencyContactName: "",
    patient_emergencyContactRelation: "",
    patient_emergencyContactNumber: "",
    patient_medicalConditions: "",
    patient_pastSurgeries: "",
    patient_medications: "",
    patient_allergies: "",
    patient_disabilities: "",
    patient_height: "", // Add height
    patient_weight: ""  // Add weight
  });

  const [medicalReportFile, setMedicalReportFile] = useState(null); // Store selected file

  const formDataRef = useRef(formData);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    formDataRef.current = { ...formDataRef.current, [name]: value };
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileUpload = (e) => {
    const files = [...e.target.files];
    const allowedTypes = ["image/jpeg", "image/png"];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
  
    if (validFiles.length !== files.length) {

      toast.error("Only JPG and PNG files are allowed!", { position: "top-right" });
      return;
    }
  
    setMedicalReportFile(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (step === 4 && submitCount === 1) {
      const { patient_email, patient_password, patient_phone, patient_emergencyContactNumber } = formData;
  
      // Email validation regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(patient_email)) {
        setSubmitCount(0);
        toast.error("Invalid email format!", { position: "top-right" });
        return;
      }
  
      // Password validation regex
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      if (!passwordRegex.test(patient_password)) {
        setSubmitCount(0);
        toast.error("Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character!", { position: "top-right" });
        return;
      }

      const mobileRegex =  /^[6-9]\d{9}$/;
      if (!mobileRegex.test(patient_phone)) {
        setSubmitCount(0);
        toast.error("Invalid patient mobile number!", { position: "top-right" });
        return;
      }

      if (!mobileRegex.test(patient_emergencyContactNumber)) {
        setSubmitCount(0);
        toast.error("Invalid emergency mobile number!", { position: "top-right" });
        return;
      }

      // Ensure all fields are filled
      if (Object.values(formData).some(field => field.trim() === "")) {
        setSubmitCount(0);
        toast.error("Please fill in all fields!", { position: "top-right" });
        return;
      }
  
      const data = new FormData();
  
      // Append all form fields
      for (let key in formData) {
        data.append(key, formData[key]);
      }
  
      // Append file if available
      if (medicalReportFile && medicalReportFile.length > 0) {
        medicalReportFile.forEach(file => data.append("patient_prevMedicalReports", file));
      }
  
      try {
        const response = await fetch(`${BASE_URL}/api/auth/patientRegister`, {
          method: "POST",
          body: data,
        });
  
        const result = await response.json();
  
        if (response.ok) {
          toast.success("Registration Successful", { position: "top-right" });
          setSubmitCount(0);
          setFormData({
            patient_fullName: "",
            patient_dob: "",
            patient_gender: "",
            patient_bloodGroup: "",
            patient_maritalStatus: "",
            patient_phone: "",
            patient_email: "",
            patient_password: "",
            patient_address: "",
            patient_emergencyContactName: "",
            patient_emergencyContactRelation: "",
            patient_emergencyContactNumber: "",
            patient_medicalConditions: "",
            patient_pastSurgeries: "",
            patient_medications: "",
            patient_allergies: "",
            patient_disabilities: "",
            patient_height: "", // Add height
            patient_weight: ""  // Add weight
          });
          setMedicalReportFile(null);
        } else {
          toast.error(result.message || "Registration failed", { position: "top-right" });
        }
      } catch (error) {
        toast.error("Something went wrong!", { position: "top-right" });
      }
    }
  };

  return (
    <>
    <div className="h-screen bg-[#a9e9e6] flex justify-center items-center">
      <div className="h-auto w-full bg-[#a9e9e6] bg-opacity-90 flex items-center justify-center mt-12"> {/* Increased top margin */}
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl border border-[#66D2CE] p-8"> {/* Slightly increased width and height */}
          <h2 className="text-2xl font-bold text-[#66D2CE] mb-6 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 mr-2" />
            Patient Registration
          </h2>

          <div className="flex justify-between mb-6 gap-2">
            {[
              { name: "Personal", icon: User },
              { name: "Contact", icon: Phone },
              { name: "Emergency", icon: HeartPulse },
              { name: "Medical", icon: FileText },
            ].map((sec, index) => (
              <Button
                key={index}
                onClick={() => setStep(index + 1)}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                  step === index + 1 ? "bg-[#008080] text-white" : "bg-[#66D2CE] text-gray-700"
                }`}
              >
                <sec.icon className="w-4 h-4 mr-1" />
                {sec.name}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit} enctype="multipart/form-data" className="space-y-6"> {/* Increased spacing between form elements */}
            {step === 1 && (
              <>
                <Input label="Full Name *" name="patient_fullName" icon={User} value={formData.patient_fullName} onChange={handleChange} />
                <Input label="Date of Birth" name="patient_dob" type="date" icon={User} value={formData.patient_dob} onChange={handleChange} />
                <Dropdown label="Gender *" name="patient_gender" options={["Male", "Female", "Other"]} icon={User} value={formData.patient_gender} onChange={handleChange} />
                <Dropdown label="Blood Group *" name="patient_bloodGroup" options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} icon={HeartPulse} value={formData.patient_bloodGroup} onChange={handleChange} />
                <Dropdown label="Marital Status *" name="patient_maritalStatus" options={["Single", "Married", "Divorced", "Widowed"]} icon={User} value={formData.patient_maritalStatus} onChange={handleChange} />
                <Input label="Height (cm) *" name="patient_height" type="number" icon={User} value={formData.patient_height} onChange={handleChange} /> {/* Add height input */}
                <Input label="Weight (kg) *" name="patient_weight" type="number" icon={User} value={formData.patient_weight} onChange={handleChange} /> {/* Add weight input */}
              </>
            )}

            {step === 2 && (
              <>
                <Input label="Phone Number *" name="patient_phone" type="tel" icon={Phone} value={formData.patient_phone} onChange={handleChange} />
                <Input label="Email Address *" name="patient_email" type="email" icon={Mail} value={formData.patient_email} onChange={handleChange} />
                <Input label="Password *" name="patient_password" type="password" icon={Eye} value={formData.patient_password} onChange={handleChange} />
                <Input label="Address *" name="patient_address" icon={Home} value={formData.patient_address} onChange={handleChange} />
              </>
            )}

            {step === 3 && (
              <>
                <Input label="Emergency Contact Name *" name="patient_emergencyContactName" icon={User} value={formData.patient_emergencyContactName} onChange={handleChange} />
                <Dropdown label="Relation *" name="patient_emergencyContactRelation" options={["Parent", "Sibling", "Spouse", "Friend", "Other"]} icon={User} value={formData.patient_emergencyContactRelation} onChange={handleChange} />
                <Input label="Emergency Contact Number *" name="patient_emergencyContactNumber" type="tel" icon={Phone} value={formData.patient_emergencyContactNumber} onChange={handleChange} />
              </>
            )}

            {step === 4 && (
              <>
                <div className="grid grid-cols-2 gap-4"> {/* Increased gap between grid items */}
                  <Input label="Medical Conditions *" name="patient_medicalConditions" icon={FileText} value={formData.patient_medicalConditions} onChange={handleChange} />
                  <Input label="Past Surgeries *" name="patient_pastSurgeries" icon={FileText} value={formData.patient_pastSurgeries} onChange={handleChange} />
                  <Input label="Medications *" name="patient_medications" icon={FileText} value={formData.patient_medications} onChange={handleChange} />
                  <Input label="Allergies *" name="patient_allergies" icon={AlertTriangle} value={formData.patient_allergies} onChange={handleChange} />
                  <Input label="Disabilities *" name="patient_disabilities" icon={AlertTriangle} value={formData.patient_disabilities} onChange={handleChange} />
                  
                  <div className="mb-4 flex items-center bg-white rounded-lg border border-[#66D2CE] p-2 overflow-hidden">
                    <label htmlFor="patient_prevMedicalReports" className="cursor-pointer bg-white py-2 rounded-md flex items-center">
                      <FileText className="text-[#66D2CE] w-5 h-5 mx-3" />
                      <span className={`w-full p-2 focus:outline-none overflow-hidden ${medicalReportFile && medicalReportFile.length > 0 ? "text-black" : "text-gray-500"}`}>{medicalReportFile && medicalReportFile.length > 0 
                        ? medicalReportFile.map((file) => file.name).join(", ") 
                        : "Upload Previous Reports"}
                      </span>
                    </label>
                    <input
                      id="patient_prevMedicalReports"
                      type="file"
                      name="patient_prevMedicalReports"
                      accept=".pdf,.jpg,.png"
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)} 
                  className="px-5 py-2 text-white bg-[#66D2CE] rounded-lg hover:bg-[#4ab7b3] flex items-center">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </button>
              )}

              {step < 4 ? (
                <button 
                  type="button" 
                  onClick={() => setStep(step + 1)} 
                  className="px-5 py-2 text-white bg-[#66D2CE] rounded-lg hover:bg-[#4ab7b3] flex items-center">
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  onClick={() => setSubmitCount(1)}
                  className="px-6 py-2 text-white bg-[#66D2CE] rounded-lg hover:bg-[#4ab7b3]">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};

export default PatientRegistration;