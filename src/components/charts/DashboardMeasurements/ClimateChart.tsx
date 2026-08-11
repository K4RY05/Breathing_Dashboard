// src/components/charts/DashboardMeasurements/ClimateChart.tsx

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

interface ClimateChartProps {
  data: CleanSensorRecord[];
}

export const ClimateChart: React.FC<ClimateChartProps> = ({ data }) => {
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
        label: "Temperatura Manifold (°C)",
        data: data.map((d) => d.manifoldTemp),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        yAxisID: "yTemp",
        tension: 0.2,
      },
      {
        label: "Humedad Relativa (%)",
        data: data.map((d) => d.manifoldRh),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.5)",
        yAxisID: "yRh",
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
        text: "Variables Climáticas",
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
      yTemp: {
        type: "linear" as const,
        position: "left" as const,

        title: {
          display: true,
          text: "Temperatura (°C)",
        },
      },

      yRh: {
        type: "linear" as const,
        position: "right" as const,

        title: {
          display: true,
          text: "Humedad (%)",
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