import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const getStatusColor = (status) => {
  switch (status) {
    case 'APPLIED':
      return '#FCD34D'; // Yellow
    case 'SHORTLISTED':
      return '#60A5FA'; // Blue
    case 'ACCEPTED':
      return '#34D399'; // Green
    case 'REJECTED':
      return '#F87171'; // Red
    case 'WITHDRAWN':
      return '#9CA3AF'; // Gray
    case 'IN_PROGRESS':
      return '#A78BFA'; // Purple
    case 'SUBMITTED':
      return '#FBBF24'; // Orange
    case 'COMPLETED':
      return '#10B981'; // Emerald
    case 'CANCELLED':
      return '#6B7280'; // Slate
    default:
      return '#E5E7EB'; // Light gray
  }
};

const getStatusDisplay = (status) => {
  switch (status) {
    case 'APPLIED':
      return 'Applied';
    case 'SHORTLISTED':
      return 'Shortlisted';
    case 'ACCEPTED':
      return 'Accepted';
    case 'REJECTED':
      return 'Rejected';
    case 'WITHDRAWN':
      return 'Withdrawn';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'SUBMITTED':
      return 'Submitted';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

const StatisticsPieChart = ({ statistics }) => {
  if (!statistics) return null;

  // Convert the statistics object to arrays for the chart
  const labels = Object.keys(statistics).map(key => getStatusDisplay(key));
  const data = Object.values(statistics);
  const backgroundColors = Object.keys(statistics).map(key => getStatusColor(key));

  // Calculate total applications
  const totalApplications = data.reduce((sum, count) => sum + count, 0);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalApplications) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
        <p className="text-3xl font-bold text-primary-600">{totalApplications}</p>
      </div>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatisticsPieChart; 