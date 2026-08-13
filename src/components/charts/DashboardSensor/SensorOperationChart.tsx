// src/components/charts/DashboardSensor/SensorOperationChart.tsx

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
  Legend
);

interface SensorOperationChartProps {
  data: CleanSensorRecord[];
}

export function SensorOperationChart({
  data,
}: SensorOperationChartProps): React.JSX.Element {
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

  const chartData: ChartData<"line"> = useMemo(() => {
    const labels = data.map((r) => r.timestamp);

    return {
      labels,
      datasets: [
        {
          label: "Flowrate",
          data: data.map((r) => r.flowrate),
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f6",
          pointRadius: 0,
          borderWidth: 1.5,
          spanGaps: true,
          tension: 0.2,
          yAxisID: "yLeft",
        },
        {
          label: "Sample period",
          data: data.map((r) => r.samplePeriod),
          borderColor: "#22c55e",
          backgroundColor: "#22c55e",
          pointRadius: 0,
          borderWidth: 1.5,
          spanGaps: true,
          tension: 0.2,
          yAxisID: "yLeft",
        },
        {
          label: "Laser status",
          data: data.map((r) => r.laserStatus),
          borderColor: "#f97316",
          backgroundColor: "#f97316",
          pointRadius: 0,
          borderWidth: 1.5,
          spanGaps: true,
          tension: 0.2,
          yAxisID: "yRight",
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            return `${ctx.dataset.label}: ${
              v === null || v === undefined ? "sin dato" : v
            }`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
      },
      yLeft: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Flowrate / Sample period" },
      },
      yRight: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Laser status" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

// Exportación por defecto para compatibilidad
export default SensorOperationChart;