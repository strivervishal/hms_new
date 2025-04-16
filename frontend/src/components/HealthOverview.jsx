import { FaWeight, FaRulerVertical, FaAccessibleIcon, FaHeartbeat } from 'react-icons/fa';
import useUserStore from '../stores/userStore';

const HealthOverview = () => {
  const { user } = useUserStore();

  const healthStats = [
    { 
      id: 1, 
      title: 'Weight', 
      value: user?.patient_weight || 'N/A', 
      unit: 'kg', 
      icon: <FaWeight className="text-primary" />,
      change: 'N/A',
      status: 'normal'
    },
    { 
      id: 2, 
      title: 'Height', 
      value: user?.patient_height || 'N/A', 
      unit: 'cm', 
      icon: <FaRulerVertical className="text-secondary" />,
      change: 'N/A',
      status: 'normal'
    },
    { 
      id: 3, 
      title: 'Disabilities', 
      value: user?.patient_disabilities || 'None', 
      unit: '', 
      icon: <FaAccessibleIcon className="text-accent" />,
      change: 'N/A',
      status: 'normal'
    },
    { 
      id: 4, 
      title: 'Blood Group', 
      value: user?.patient_bloodGroup || 'N/A', 
      unit: '', 
      icon: <FaHeartbeat className="text-red-500" />,
      change: 'N/A',
      status: 'normal'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {healthStats.map(stat => (
        <div key={stat.id} className="card hover:shadow-lg">
          <div className="stat-card">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-medium text-neutral-darkest dark:text-neutral-light">{stat.title}</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-dark-dark dark:text-white">{stat.value}</span>
                  <span className="ml-1 text-sm text-neutral-darkest dark:text-neutral-light">{stat.unit}</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-neutral-lightest dark:bg-dark">
                {stat.icon}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-neutral-darkest dark:text-neutral-light">{stat.change}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.status === 'normal' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : stat.status === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {stat.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthOverview;