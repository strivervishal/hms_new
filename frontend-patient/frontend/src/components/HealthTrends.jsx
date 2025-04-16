import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useUserStore from '../stores/userStore';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthTrends = () => {
  const { user } = useUserStore();

  // Fetch height and weight from the user object
  const heightInMeters = (user?.patient_height || 170) / 100; // Convert height to meters (default: 170 cm)
  const weightData = user?.weight_history || [60, 62, 65, 68, 70, 72]; // Fetch weight history or use default data

  // Calculate BMI for each month
  const bmiData = weightData.map((weight) => {
    return (weight / (heightInMeters * heightInMeters)).toFixed(1); // Calculate BMI and round to 1 decimal place
  });

  // Prepare data for the BMI chart
  const bmiChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Months
    datasets: [
      {
        label: 'BMI',
        data: bmiData,
        borderColor: '#1CBAB3',
        backgroundColor: 'rgba(28, 186, 179, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const bmiChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const bmi = context.raw;
            const category =
              bmi < 18.5
                ? 'Underweight'
                : bmi >= 18.5 && bmi <= 24.9
                ? 'Normal'
                : 'Overweight';
            return `BMI: ${bmi} (${category})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'BMI',
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  // State for Hb data
  const [hbData, setHbData] = useState([]);
  const [month, setMonth] = useState('');
  const [hbLevel, setHbLevel] = useState('');

  // Handle form submission
  const handleAddHbData = (e) => {
    e.preventDefault();

    if (!month || !hbLevel) {
      alert('Please enter both month and Hb level.');
      return;
    }

    // Add the new Hb data
    setHbData((prevData) => [
      ...prevData,
      { month, hb: parseFloat(hbLevel) },
    ]);

    // Clear the input fields
    setMonth('');
    setHbLevel('');
  };

  // Prepare data for the Hemoglobin chart
  const hbChartData = {
    labels: hbData.map((data) => data.month), // Use months as labels
    datasets: [
      {
        label: 'Hemoglobin (Hb)',
        data: hbData.map((data) => data.hb), // Use Hb levels as data
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const hbChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const hb = context.raw;
            const category =
              hb < 12
                ? 'Low'
                : hb >= 12 && hb <= 16
                ? 'Normal'
                : 'High';
            return `Hb: ${hb} g/dL (${category})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Hemoglobin (g/dL)',
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* BMI Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-dark-dark dark:text-white mb-4">
          BMI Tracking
        </h2>
        <Line data={bmiChartData} options={bmiChartOptions} />
      </div>

      {/* Hemoglobin Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-dark-dark dark:text-white mb-4">
          Hemoglobin (Hb) Levels
        </h2>
        <form onSubmit={handleAddHbData} className="mb-4">
          <div className="flex items-center mb-2">
            <label className="mr-2">Month:</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="e.g., Jan"
              className="border border-gray-300 rounded px-2 py-1 mr-4 bg-white text-black"
            />
            <label className="mr-2">Hb Level:</label>
            <input
              type="number"
              value={hbLevel}
              onChange={(e) => setHbLevel(e.target.value)}
              placeholder="e.g., 13.5"
              className="border border-gray-300 rounded px-2 py-1 bg-white text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Data
          </button>
        </form>
        <Line data={hbChartData} options={hbChartOptions} />
      </div>
    </div>
  );
};

export default HealthTrends;