import { Link } from 'react-router-dom';
import HealthOverview from '../components/HealthOverview';
import HealthTrends from '../components/HealthTrends';
import useUserStore from '../stores/userStore';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const { user, fetchUser } = useUserStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!user && userId && token) {
      fetchUser(userId, token).catch((err) => {
        console.error('Error loading dashboard:', err.message);
        setError('Failed to fetch user data.');
      });
    } else if (!token) {
      setError('Authentication token is missing. Please log in again.');
    }
  }, [user, fetchUser]);

  const handleDownload = async () => {
    // Hide elements that should not appear in the PDF
    const elementsToHide = document.querySelectorAll('.exclude-from-pdf');
    elementsToHide.forEach((el) => (el.style.display = 'none'));

    const element = document.querySelector('.pdf-content'); // Target only the content to include in the PDF
    const canvas = await html2canvas(element, { scale: 2 }); // Higher scale for better quality
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Health_Report.pdf');

    // Restore visibility of hidden elements
    elementsToHide.forEach((el) => (el.style.display = ''));
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Exclude navbar and sidebar */}
      <div className="exclude-from-pdf">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-dark dark:text-white">
              Welcome, {user?.patient_fullName || 'Patient'}
            </h1>
            <p className="text-neutral-darkest dark:text-neutral-light">
              Here's your health summary
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download Health Report
            </button>
            <Link to="/prescriptions" className="btn btn-secondary">
              View Medical History
            </Link>
          </div>
        </div>
      </div>
      {/* Content to include in the PDF */}
      <div className="pdf-content">
        <HealthOverview />
        <HealthTrends />
      </div>
    </div>
  );
};

export default Dashboard;
