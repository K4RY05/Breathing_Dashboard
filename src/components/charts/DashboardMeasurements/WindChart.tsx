// src/components/charts/DashboardMeasurements/WindChart.tsx
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

export const WindChart: React.FC = () => {
  const { data, loading, error } = useSensorData();

  if (loading) return <div>Cargando datos del viento...</div>;
  if (error) return <div>Error: {error}</div>;

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Velocidad del Viento (m/s)',
        data: data.map((d) => d.windSpeed),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        yAxisID: 'ySpeed',
        tension: 0.2,
      },
      {
        label: 'Dirección del Viento (°)',
        data: data.map((d) => d.windDir),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        yAxisID: 'yDir',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      ySpeed: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: 'Velocidad (m/s)' },
      },
      yDir: {
        type: 'linear' as const,
        position: 'right' as const,
        min: 0,
        max: 360,
        title: { display: true, text: 'Dirección (°)' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};