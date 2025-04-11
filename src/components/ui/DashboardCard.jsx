// src/components/DashboardCard.jsx
import React from 'react';

export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-2xl font-bold mt-2 text-blue-600">{value}</p>
    </div>
  );
}
