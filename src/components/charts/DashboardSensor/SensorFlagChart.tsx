// src/components/charts/SensorFlagChart.tsx

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

interface SensorFlagChartProps {
  data: CleanSensorRecord[];
}

export const SensorFlagChart: React.FC<SensorFlagChartProps> = ({ data }) => {
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

  const { chartData, currentFlag, baselineFlag, currentIsBaseline } = useMemo(() => {
    // Contamos cuántas lecturas cayeron en cada código de flag
    const counts = new Map<number, number>();
    for (const r of data) {
      if (r.flag === null) continue;
      counts.set(r.flag, (counts.get(r.flag) ?? 0) + 1);
    }

    // El código más frecuente = estado "normal" de operación en este periodo
    let baseline: number | null = null;
    let baselineCount = -1;
    counts.forEach((count, flag) => {
      if (count > baselineCount) {
        baseline = flag;
        baselineCount = count;
      }
    });

    const sortedEntries = Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);

    const cd: ChartData<"bar"> = {
      labels: sortedEntries.map(([flag]) => `Código ${flag}`),
      datasets: [
        {
          label: "Lecturas",
          data: sortedEntries.map(([, count]) => count),
          backgroundColor: sortedEntries.map(([flag]) =>
            flag === baseline ? "#22c55e" : "#ef4444"
          ),
          borderRadius: 4,
        },
      ],
    };

    // Última lectura no-nula, para el indicador de estado actual
    let last: number | null = null;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].flag !== null) {
        last = data[i].flag;
        break;
      }
    }

    return {
      chartData: cd,
      currentFlag: last,
      baselineFlag: baseline,
      currentIsBaseline: last !== null && last === baseline,
    };
  }, [data]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const count = ctx.parsed.y as number;
            const pct = ((count / data.length) * 100).toFixed(1);
            return `${count} lectura(s) — ${pct}% del periodo`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Nº de lecturas" },
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Indicador de estado actual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
          padding: "8px 12px",
          borderRadius: 8,
          backgroundColor: currentIsBaseline ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${currentIsBaseline ? "#bbf7d0" : "#fecaca"}`,
          width: "fit-content",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: currentIsBaseline ? "#22c55e" : "#ef4444",
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: 13, color: "#334155" }}>
          {currentFlag === null
            ? "Sin dato de estado en la última lectura"
            : currentIsBaseline
            ? `Estado estable (código ${currentFlag})`
            : `Estado distinto al habitual (código ${currentFlag}, normal es ${baselineFlag})`}
        </span>
      </div>

      <div style={{ height: "300px", width: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};