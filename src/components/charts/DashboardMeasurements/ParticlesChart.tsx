// src/components/charts/DashboardMeasurements/ParticlesChart.tsx

import React from "react";
import type { CleanSensorRecord } from "../../../types/sensorData";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ParticlesChartProps {
  data: CleanSensorRecord[];
}

export const ParticlesChart: React.FC<ParticlesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: "350px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#64748b" }}>
          No hay registros disponibles para el rango seleccionado.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.timestamp),

    datasets: [
      {
        label: "PM 1.0 (µg/m³)",
        data: data.map((d) => d.pm1),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        tension: 0.2,
      },
      {
        label: "PM 2.5 (µg/m³)",
        data: data.map((d) => d.pm25),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        tension: 0.2,
      },
      {
        label: "PM 10 (µg/m³)",
        data: data.map((d) => d.pm10),
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244, 63, 94, 0.15)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      title: {
        display: true,
        text: "Concentración de Partículas",
      },

      legend: {
        position: "top" as const,
      },

      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Hora de medición",
        },
      },

      y: {
        title: {
          display: true,
          text: "Concentración (µg/m³)",
        },

        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};