// src/components/charts/DashboardMeasurements/AirQualityChart.tsx
import React from 'react';
import type { CleanSensorRecord } from '../../../types/sensorData';
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

interface AirQualityChartProps {
  data: CleanSensorRecord[];
}

export const AirQualityChart: React.FC<AirQualityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '350px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b' }}>No hay registros disponibles para el rango seleccionado.</p>
      </div>
    );
  }

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