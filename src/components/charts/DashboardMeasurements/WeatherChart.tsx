// src/components/charts/DashboardMeasurements/WeatherChart.tsx

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

interface WeatherChartProps {
  data: CleanSensorRecord[];
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
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
        label: "Presión Atmosférica (Pa)",
        data: data.map((d) => d.pressure),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        yAxisID: "yPres",
        tension: 0.2,
      },
      {
        label: "Punto de Rocío (°C)",
        data: data.map((d) => d.dewPoint),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20, 184, 166, 0.5)",
        yAxisID: "yDew",
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
        text: "Datos Meteorológicos",
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
      yPres: {
        type: "linear" as const,
        position: "left" as const,

        title: {
          display: true,
          text: "Presión (Pa)",
        },
      },

      yDew: {
        type: "linear" as const,
        position: "right" as const,

        title: {
          display: true,
          text: "Punto de Rocío (°C)",
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