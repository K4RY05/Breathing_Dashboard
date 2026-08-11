// src/components/charts/DashboardMeasurements/WindChart.tsx

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

interface WindChartProps {
  data: CleanSensorRecord[];
}

export const WindChart: React.FC<WindChartProps> = ({ data }) => {
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
        label: "Velocidad del Viento (m/s)",
        data: data.map((d) => d.windSpeed),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.5)",
        yAxisID: "ySpeed",
        tension: 0.2,
      },
      {
        label: "Dirección del Viento (°)",
        data: data.map((d) => d.windDir),
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.5)",
        yAxisID: "yDir",
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
        text: "Condiciones del Viento",
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
      ySpeed: {
        type: "linear" as const,
        position: "left" as const,

        title: {
          display: true,
          text: "Velocidad (m/s)",
        },

        beginAtZero: true,
      },

      yDir: {
        type: "linear" as const,
        position: "right" as const,
        min: 0,
        max: 360,

        title: {
          display: true,
          text: "Dirección (°)",
        },

        grid: {
          drawOnChartArea: false,
        },
      },

      x: {
        title: {
          display: true,
          text: "Hora de medición",
        },
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};