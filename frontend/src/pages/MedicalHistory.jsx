import { useState } from 'react'
import { FaFileMedical, FaDownload, FaEye } from 'react-icons/fa'

const MedicalHistory = () => {
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      type: 'Diagnosis',
      title: 'Hypertension',
      date: '2024-12-10',
      doctor: 'Dr. Sarah Johnson',
      facility: 'Heart Care Center',
      details: 'Diagnosed with Stage 1 Hypertension. Blood pressure consistently above 130/80 mmHg.',
      attachments: [
        { name: 'Blood Pressure Report.pdf', size: '1.2 MB' }
      ]
    },
    {
      id: 2,
      type: 'Lab Test',
      title: 'Complete Blood Count',
      date: '2025-01-15',
      doctor: 'Dr. Emily Rodriguez',
      facility: 'Community Health Center',
      details: 'All values within normal range.',
      attachments: [
        { name: 'CBC Results.pdf', size: '0.8 MB' }
      ]
    },
    {
      id: 3,
      type: 'Procedure',
      title: 'Echocardiogram',
      date: '2025-02-20',
      doctor: 'Dr. Sarah Johnson',
      facility: 'Heart Care Center',
      details: 'Normal heart function. Ejection fraction 60%.',
      attachments: [
        { name: 'Echocardiogram Report.pdf', size: '2.5 MB' },
        { name: 'Heart Images.jpg', size: '4.1 MB' }
      ]
    },
    {
      id: 4,
      type: 'Vaccination',
      title: 'Influenza Vaccine',
      date: '2025-03-05',
      doctor: 'Dr. Michael Chen',
      facility: 'Community Health Center',
      details: 'Annual flu vaccination administered.',
      attachments: [
        { name: 'Vaccination Record.pdf', size: '0.5 MB' }
      ]
    }
  ])

  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterType, setFilterType] = useState('All')

  const filteredRecords = filterType === 'All' 
    ? medicalRecords 
    : medicalRecords.filter(record => record.type === filterType)

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setShowModal(true)
  }

  const recordTypes = ['All', ...new Set(medicalRecords.map(record => record.type))]

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-dark dark:text-white">Medical History</h1>
          <p className="text-neutral-darkest dark:text-neutral-light">View your complete medical records</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="btn btn-primary">Download Complete History</button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {recordTypes.map(type => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm ${
                filterType === type
                  ? 'bg-primary text-white'
                  : 'bg-neutral-lightest dark:bg-dark text-neutral-darkest dark:text-neutral-light hover:bg-neutral-light dark:hover:bg-dark-light'
              }`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral dark:divide-dark-light">
              <thead className="bg-neutral-lightest dark:bg-dark">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-darkest dark:text-neutral-light uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-light divide-y divide-neutral dark:divide-dark">
                {filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-neutral-lightest dark:hover:bg-dark">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === 'Diagnosis' 
                          ? 'bg-accent bg-opacity-10 text-accent' 
                          : record.type === 'Lab Test'
                          ? 'bg-primary bg-opacity-10 text-primary'
                          : record.type === 'Procedure'
                          ? 'bg-secondary bg-opacity-10 text-secondary-dark'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-dark-dark dark:text-white">{record.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-dark dark:text-white">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-dark dark:text-white">{record.doctor}</div>
                      <div className="text-xs text-neutral-darkest dark:text-neutral-light">{record.facility}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(record)}
                        className="text-primary hover:text-primary-dark inline-flex items-center mr-3"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <button className="text-primary hover:text-primary-dark inline-flex items-center">
                        <FaDownload className="mr-1" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-darkest dark:text-neutral-light">No medical records found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Medical Record Details Modal */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-light rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedRecord.type === 'Diagnosis' 
                      ? 'bg-accent bg-opacity-10 text-accent' 
                      : selectedRecord.type === 'Lab Test'
                      ? 'bg-primary bg-opacity-10 text-primary'
                      : selectedRecord.type === 'Procedure'
                      ? 'bg-secondary bg-opacity-10 text-secondary-dark'
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {selectedRecord.type}
                  </span>
                  <h3 className="text-lg font-semibold text-dark-dark dark:text-white mt-1">{selectedRecord.title}</h3>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-neutral-darkest dark:text-neutral-light hover:text-dark-dark dark:hover:text-white"
                >
                  &times;
                </button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Date</p>
                  <p className="text-md text-dark-dark dark:text-white">
                    {new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Doctor</p>
                  <p className="text-md text-dark-dark dark:text-white">{selectedRecord.doctor}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Facility</p>
                  <p className="text-md text-dark-dark dark:text-white">{selectedRecord.facility}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-neutral-darkest dark:text-neutral-light">Details</p>
                  <p className="text-md text-dark-dark dark:text-white">{selectedRecord.details}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium text-dark-dark dark:text-white mb-2">Attachments</p>
                <div className="space-y-2">
                  {selectedRecord.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-lightest dark:bg-dark rounded-md">
                      <div className="flex items-center">
                        <FaFileMedical className="text-primary mr-2" />
                        <span className="text-sm text-dark-dark dark:text-white">{attachment.name}</span>
                        <span className="text-xs text-neutral-darkest dark:text-neutral-light ml-2">({attachment.size})</span>
                      </div>
                      <div>
                        <button className="text-primary hover:text-primary-dark mr-2">
                          <FaEye />
                        </button>
                        <button className="text-primary hover:text-primary-dark">
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="btn btn-primary">Download Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalHistory