import { useState } from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd, FaEllipsisV } from 'react-icons/fa'

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2025-05-15',
      time: '10:00 AM',
      location: 'Heart Care Center',
      status: 'upcoming'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      date: '2025-05-20',
      time: '2:30 PM',
      location: 'Skin Health Clinic',
      status: 'upcoming'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'General Practitioner',
      date: '2025-04-10',
      time: '9:15 AM',
      location: 'Community Health Center',
      status: 'completed'
    }
  ])

  const [activeTab, setActiveTab] = useState('upcoming')

  const filteredAppointments = appointments.filter(
    appointment => appointment.status === activeTab
  )

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-dark-dark dark:text-white">Appointments</h2>
        <button className="btn btn-outline text-sm">+ New Appointment</button>
      </div>

      <div className="flex border-b border-neutral dark:border-dark-light mb-4">
        <button 
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'upcoming' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-darkest dark:text-neutral-light'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'completed' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-darkest dark:text-neutral-light'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Past
        </button>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="border border-neutral dark:border-dark-light rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-dark-dark dark:text-white">{appointment.doctor}</h3>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">{appointment.specialty}</p>
                </div>
                <div className="relative">
                  <button className="p-1 rounded-full hover:bg-neutral-lightest dark:hover:bg-dark-light">
                    <FaEllipsisV className="text-neutral-darkest dark:text-neutral-light" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center text-sm">
                  <FaCalendarAlt className="mr-2 text-primary" />
                  <span className="text-dark-light dark:text-neutral-light">
                    {new Date(appointment.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FaClock className="mr-2 text-primary" />
                  <span className="text-dark-light dark:text-neutral-light">{appointment.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaUserMd className="mr-2 text-primary" />
                  <span className="text-dark-light dark:text-neutral-light">{appointment.doctor}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaMapMarkerAlt className="mr-2 text-primary" />
                  <span className="text-dark-light dark:text-neutral-light">{appointment.location}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                {activeTab === 'upcoming' ? (
                  <>
                    <button className="btn btn-primary text-xs">Reschedule</button>
                    <button className="btn btn-outline text-xs">Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary text-xs">View Details</button>
                    <button className="btn btn-outline text-xs">Book Again</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-darkest dark:text-neutral-light">No {activeTab} appointments found.</p>
          {activeTab === 'upcoming' && (
            <button className="mt-2 btn btn-primary text-sm">Schedule an Appointment</button>
          )}
        </div>
      )}
    </div>
  )
}

export default AppointmentList