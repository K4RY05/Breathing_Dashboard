// src/components/charts/DashboardSensor/SamplingChart.tsx

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import type { CleanSensorRecord } from "../../../types/sensorData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface SamplingChartProps {
  data: CleanSensorRecord[];
  expectedIntervalSeconds?: number; // Intervalo nominal esperado
  gapToleranceFactor?: number;      // Cuánto más grande que lo esperado se considera "hueco"
}

export function SamplingChart({
  data,
  expectedIntervalSeconds = 10,
  gapToleranceFactor = 1.5,
}: SamplingChartProps): React.JSX.Element {
  if (!data || data.length < 2) {
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
          No hay suficientes registros para calcular la frecuencia de muestreo.
        </p>
      </div>
    );
  }

  const { chartData, gapCount, maxGap, avgInterval, pctOnTime } = useMemo(() => {
    // Se asume data ordenada cronológicamente (proveniente de useSensorData)
    const intervals: { label: string; seconds: number }[] = [];

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1].dateObj.getTime();
      const curr = data[i].dateObj.getTime();
      const seconds = (curr - prev) / 1000;
      if (seconds <= 0) continue; // ignora duplicados / desorden
      intervals.push({ label: data[i].timestamp, seconds });
    }

    const gapThreshold = expectedIntervalSeconds * gapToleranceFactor;
    const gaps = intervals.filter((i) => i.seconds > gapThreshold);
    const onTime = intervals.filter((i) => i.seconds <= gapThreshold);
    const max = intervals.length ? Math.max(...intervals.map((i) => i.seconds)) : 0;
    const avg = intervals.length
      ? intervals.reduce((a, b) => a + b.seconds, 0) / intervals.length
      : 0;

    const cd: ChartData<"bar"> = {
      labels: intervals.map((i) => i.label),
      datasets: [
        {
          label: "Intervalo entre lecturas (s)",
          data: intervals.map((i) => i.seconds),
          backgroundColor: intervals.map((i) =>
            i.seconds > gapThreshold ? "#ef4444" : "#3b82f6"
          ),
          borderRadius: 2,
        },
      ],
    };

    return {
      chartData: cd,
      gapCount: gaps.length,
      maxGap: max,
      avgInterval: avg,
      pctOnTime: intervals.length ? (onTime.length / intervals.length) * 100 : 0,
    };
  }, [data, expectedIntervalSeconds, gapToleranceFactor]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const s = ctx.parsed.y as number;
            const flag =
              s > expectedIntervalSeconds * gapToleranceFactor
                ? " ⚠️ hueco de transmisión"
                : "";
            return `${s.toFixed(1)} s${flag}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Segundos entre lecturas" },
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
        <span>Intervalo esperado: {expectedIntervalSeconds}s</span>
        <span>Promedio real: {avgInterval.toFixed(1)}s</span>
        <span>% dentro de lo esperado: {pctOnTime.toFixed(1)}%</span>
        <span style={{ color: gapCount > 0 ? "#ef4444" : "#64748b" }}>
          Huecos detectados: {gapCount} (máx {maxGap.toFixed(0)}s)
        </span>
      </div>
      <div style={{ height: "300px", width: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

// Exportación por defecto para mantener retrocompatibilidad
export default SamplingChart;