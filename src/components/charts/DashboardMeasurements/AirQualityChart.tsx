// src/components/charts/DashboardMeasurements/AirQualityChart.tsx
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

export const AirQualityChart: React.FC = () => {
  const { data, loading, error } = useSensorData();

  if (loading) return <div>Cargando calidad del aire...</div>;
  if (error) return <div>Error: {error}</div>;

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Dióxido de Carbono (CO₂ - ppm)',
        data: data.map((d) => d.co2),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.2,
      },
      /* Descomentar cuando agregues los otros gases
      {
        label: 'CO (ppb)',
        data: data.map((d) => d.co),
        borderColor: '#eab308',
      },
      {
        label: 'NO2 (ppb)',
        data: data.map((d) => d.no2),
        borderColor: '#ef4444',
      },
      */
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