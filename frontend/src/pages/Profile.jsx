import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaCalendarAlt, FaUserMd, FaShieldAlt, FaHeartbeat, FaEye, FaHome, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa' // Import necessary icons
import { toast } from "react-toastify";
import { updatePatientProfile } from '../api/axios';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/getPatientProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
          setEditedProfile(data); // Include files in the editable profile
        } else {
          console.log('Failed to fetch profile data');
          toast.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error fetching profile data');
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (field, value) => {
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  const handleFileUpload = (e) => {
    const files = [...e.target.files];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
  
    if (validFiles.length !== files.length) {
      toast.error("Only JPG, PNG, and PDF files are allowed!", { position: "top-right" });
      return;
    }
  
    setEditedProfile({
      ...editedProfile,
      patient_prevMedicalReports: validFiles
    });
  };

  const handleSave = async () => {
    try {
      console.log('Saving profile data:', editedProfile); // Debug log
      
      const response = await updatePatientProfile(editedProfile);
      console.log('Server response:', response); // Debug log

      setProfileData(response);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedProfile({...profileData});
    setIsEditing(false);
  };

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-dark dark:text-white">My Profile</h1>
          <p className="text-neutral-darkest dark:text-neutral-light">Manage your personal information</p>
        </div>
        <div className="mt-4 md:mt-0">
          {isEditing ? (
            <div className="space-x-2">
              <button onClick={handleCancel} className="btn btn-outline">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
                {profileData.patient_fullName ? `${profileData.patient_fullName.split(' ')[0][0]}${profileData.patient_fullName.split(' ')[1] ? profileData.patient_fullName.split(' ')[1][0] : ''}` : ''}
              </div>
              <h2 className="text-xl font-semibold text-dark-dark dark:text-white">{profileData.patient_fullName}</h2>
              <p className="text-neutral-darkest dark:text-neutral-light">Patient ID: {profileData._id}</p>
              
              <div className="w-full mt-6 space-y-1">
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'personal' 
                      ? 'bg-primary text-white' 
                      : 'text-dark-dark dark:text-white hover:bg-neutral-lightest dark:hover:bg-dark'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  <FaUser className="inline mr-2" /> Personal Information
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'contact' 
                      ? 'bg-primary text-white' 
                      : 'text-dark-dark dark:text-white hover:bg-neutral-lightest dark:hover:bg-dark'
                  }`}
                  onClick={() => setActiveTab('contact')}
                >
                  <FaEnvelope className="inline mr-2" /> Contact Information
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'emergency' 
                      ? 'bg-primary text-white' 
                      : 'text-dark-dark dark:text-white hover:bg-neutral-lightest dark:hover:bg-dark'
                  }`}
                  onClick={() => setActiveTab('emergency')}
                >
                  <FaHeartbeat className="inline mr-2" /> Emergency Information
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'medical' 
                      ? 'bg-primary text-white' 
                      : 'text-dark-dark dark:text-white hover:bg-neutral-lightest dark:hover:bg-dark'
                  }`}
                  onClick={() => setActiveTab('medical')}
                >
                  <FaUserMd className="inline mr-2" /> Medical Information
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'personal' && (
              <div>
                <h3 className="text-lg font-semibold text-dark-dark dark:text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Full Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_fullName} 
                        onChange={(e) => handleInputChange('patient_fullName', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={editedProfile.patient_dob} 
                        onChange={(e) => handleInputChange('patient_dob', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">
                        {new Date(profileData.patient_dob).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Gender</label>
                    {isEditing ? (
                      <select 
                        value={editedProfile.patient_gender} 
                        onChange={(e) => handleInputChange('patient_gender', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_gender}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Blood Type</label>
                    {isEditing ? (
                      <select 
                        value={editedProfile.patient_bloodGroup} 
                        onChange={(e) => handleInputChange('patient_bloodGroup', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_bloodGroup}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Marital Status</label>
                    {isEditing ? (
                      <select 
                        value={editedProfile.patient_maritalStatus} 
                        onChange={(e) => handleInputChange('patient_maritalStatus', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_maritalStatus}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Height (cm)</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editedProfile.patient_height} 
                        onChange={(e) => handleInputChange('patient_height', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_height} cm</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Weight (kg)</label>
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={editedProfile.patient_weight} 
                        onChange={(e) => handleInputChange('patient_weight', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_weight} kg</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'contact' && (
              <div>
                <h3 className="text-lg font-semibold text-dark-dark dark:text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Phone Number</label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        value={editedProfile.patient_phone} 
                        onChange={(e) => handleInputChange('patient_phone', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Email Address</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={editedProfile.patient_email} 
                        onChange={(e) => handleInputChange('patient_email', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Address</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_address} 
                        onChange={(e) => handleInputChange('patient_address', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_address}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'emergency' && (
              <div>
                <h3 className="text-lg font-semibold text-dark-dark dark:text-white mb-4">Emergency Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Emergency Contact Name</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_emergencyContactName} 
                        onChange={(e) => handleInputChange('patient_emergencyContactName', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_emergencyContactName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Relation</label>
                    {isEditing ? (
                      <select 
                        value={editedProfile.patient_emergencyContactRelation} 
                        onChange={(e) => handleInputChange('patient_emergencyContactRelation', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      >
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_emergencyContactRelation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Emergency Contact Number</label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        value={editedProfile.patient_emergencyContactNumber} 
                        onChange={(e) => handleInputChange('patient_emergencyContactNumber', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_emergencyContactNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'medical' && (
              <div>
                <h3 className="text-lg font-semibold text-dark-dark dark:text-white mb-4">Medical Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Medical Conditions</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_medicalConditions} 
                        onChange={(e) => handleInputChange('patient_medicalConditions', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_medicalConditions}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Past Surgeries</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_pastSurgeries} 
                        onChange={(e) => handleInputChange('patient_pastSurgeries', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_pastSurgeries}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Medications</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_medications} 
                        onChange={(e) => handleInputChange('patient_medications', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_medications}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Allergies</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_allergies} 
                        onChange={(e) => handleInputChange('patient_allergies', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_allergies}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">Disabilities</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editedProfile.patient_disabilities} 
                        onChange={(e) => handleInputChange('patient_disabilities', e.target.value)}
                        className="w-full p-2 border border-neutral dark:border-dark-light rounded-md bg-white dark:bg-dark-light text-dark-dark dark:text-white"
                      />
                    ) : (
                      <p className="text-dark-dark dark:text-white">{profileData.patient_disabilities}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-darkest dark:text-neutral-light mb-1">
                      Previous Medical Reports
                    </label>
                    {profileData.patient_prevMedicalReports && profileData.patient_prevMedicalReports.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profileData.patient_prevMedicalReports.map((fileUrl, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-dark-light border border-neutral dark:border-dark-light rounded-lg p-4 shadow-md flex flex-col items-center justify-center"
                            style={{
                              minWidth: '200px', // Minimum width for the box
                              maxWidth: '100%', // Allow it to grow dynamically
                              wordWrap: 'break-word', // Ensure long file names wrap
                            }}
                          >
                            <FaFileAlt className="text-primary w-10 h-10 mb-2" />
                            <p className="text-sm text-dark-dark dark:text-white text-center truncate">
                              {fileUrl.split('/').pop()} {/* Display the file name */}
                            </p>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-primary hover:underline text-sm px-4 py-2 border border-primary rounded-md"
                            >
                              View Report
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-darkest dark:text-neutral-light">No medical reports uploaded.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

