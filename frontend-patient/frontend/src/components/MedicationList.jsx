import { useState } from 'react'
import { FaPills, FaClock, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa'

const MedicationList = () => {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: '2025-01-15',
      endDate: '2025-07-15',
      instructions: 'Take in the morning with food',
      refillDate: '2025-05-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'active'
    },
    {
      id: 2,
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      startDate: '2025-02-10',
      endDate: '2025-08-10',
      instructions: 'Take in the evening',
      refillDate: '2025-05-10',
      doctor: 'Dr. Sarah Johnson',
      status: 'active'
    },
    {
      id: 3,
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Three times daily',
      startDate: '2025-03-01',
      endDate: '2025-03-10',
      instructions: 'Take with food',
      refillDate: null,
      doctor: 'Dr. Michael Chen',
      status: 'completed'
    }
  ])

  const activeMedications = medications.filter(med => med.status === 'active')
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-dark-dark dark:text-white">Current Medications</h2>
        <button className="btn btn-outline text-sm">View All</button>
      </div>
      
      {activeMedications.length > 0 ? (
        <div className="space-y-4">
          {activeMedications.map(medication => {
            // Calculate days until refill
            const today = new Date()
            const refillDate = new Date(medication.refillDate)
            const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24))
            const needsRefill = daysUntilRefill <= 7
            
            return (
              <div key={medication.id} className="border border-neutral dark:border-dark-light rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="p-2 mr-3 rounded-full bg-primary-light bg-opacity-20">
                      <FaPills className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dark-dark dark:text-white">{medication.name}</h3>
                      <p className="text-sm text-neutral-darkest dark:text-neutral-light">{medication.dosage} - {medication.frequency}</p>
                    </div>
                  </div>
                  
                  {needsRefill && (
                    <div className="flex items-center text-xs px-2 py-1 bg-accent bg-opacity-10 text-accent rounded-full">
                      <FaExclamationTriangle className="mr-1" />
                      <span>Refill soon</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm">
                    <FaClock className="mr-2 text-primary" />
                    <span className="text-dark-light dark:text-neutral-light">{medication.frequency}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaCalendarAlt className="mr-2 text-primary" />
                    <span className="text-dark-light dark:text-neutral-light">
                      Until {new Date(medication.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 text-sm text-dark-light dark:text-neutral-light">
                  <p><span className="font-medium">Instructions:</span> {medication.instructions}</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button className="btn btn-primary text-xs">Request Refill</button>
                  <button className="btn btn-outline text-xs">View Details</button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-darkest dark:text-neutral-light">No active medications found.</p>
        </div>
      )}
    </div>
  )
}

export default MedicationList