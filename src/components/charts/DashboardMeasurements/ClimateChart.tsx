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

export const ClimateChart: React.FC = () => {
  const { data, loading, error } = useSensorData();

  if (loading) return <div>Cargando datos del clima...</div>;
  if (error) return <div>Error: {error}</div>;

  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: 'Temperatura Manifold (°C)',
        data: data.map((d) => d.manifoldTemp),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        yAxisID: 'yTemp',
      },
      {
        label: 'Humedad Relativa (%)',
        data: data.map((d) => d.manifoldRh),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        yAxisID: 'yRh',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      yTemp: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: 'Temperatura (°C)' },
      },
      yRh: {
        type: 'linear' as const,
        position: 'right' as const,
        title: { display: true, text: 'Humedad (%)' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};