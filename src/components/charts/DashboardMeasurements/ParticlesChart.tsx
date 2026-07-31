// src/components/charts/DashboardMeasurements/ParticlesChart.tsx
import React from 'react';
import { useSensorData } from '../../../hooks/useSensorData';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const ParticlesChart: React.FC = () => {
  const { data, loading, error } = useSensorData();

  if (loading) return <div>Cargando concentraciones de partículas...</div>;
  if (error) return <div>Error: {error}</div>;

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: 'PM 1.0 (µg/m³)',
        data: data.map((d) => d.pm1),
        borderColor: '#10b981',
        tension: 0.2,
      },
      {
        label: 'PM 2.5 (µg/m³)',
        data: data.map((d) => d.pm25),
        borderColor: '#3b82f6',
        tension: 0.2,
      },
      {
        label: 'PM 10 (µg/m³)',
        data: data.map((d) => d.pm10),
        borderColor: '#f43f5e',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};