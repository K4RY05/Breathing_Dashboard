// src/components/charts/DashboardSensor/BoxTemperatureChart.tsx

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import type { CleanSensorRecord } from "../../../types/sensorData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface BoxTemperatureChartProps {
  data: CleanSensorRecord[];
}

export function BoxTemperatureChart({
  data,
}: BoxTemperatureChartProps): React.JSX.Element {
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

  const { chartData, minTemp, maxTemp, avgTemp } = useMemo(() => {
    const labels = data.map((r) => r.timestamp);
    const values = data.map((r) => r.boxTemp);

    const validValues = values.filter((v): v is number => v !== null);
    const min = validValues.length ? Math.min(...validValues) : null;
    const max = validValues.length ? Math.max(...validValues) : null;
    const avg = validValues.length
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length
      : null;

    const cd: ChartData<"line"> = {
      labels,
      datasets: [
        {
          label: "Temperatura interna (°C)",
          data: values,
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.1)",
          pointRadius: 0,
          borderWidth: 2,
          spanGaps: true,
          tension: 0.25,
          fill: true,
        },
      ],
    };

    return { chartData: cd, minTemp: min, maxTemp: max, avgTemp: avg };
  }, [data]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            return v === null || v === undefined
              ? "sin dato"
              : `${v.toFixed(1)} °C`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        title: { display: true, text: "°C" },
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 8,
          fontSize: 13,
          color: "#64748b",
          flexWrap: "wrap",
        }}
      >
        <span>Mín: {minTemp !== null ? `${minTemp.toFixed(1)} °C` : "—"}</span>
        <span>Prom: {avgTemp !== null ? `${avgTemp.toFixed(1)} °C` : "—"}</span>
        <span>Máx: {maxTemp !== null ? `${maxTemp.toFixed(1)} °C` : "—"}</span>
      </div>
      <div style={{ height: "300px", width: "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

// Exportación por defecto para mantener compatibilidad
export default BoxTemperatureChart;