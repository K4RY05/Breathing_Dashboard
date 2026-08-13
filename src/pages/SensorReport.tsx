import React, { useState } from "react";
import "../styles/SensorReport.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useSensorData } from "../hooks/useSensorData";
import { DateHourFilter } from "../components/layout/DateHourFilter";
import { NavabarFilterSensor } from "../components/layout/NavabarFilterSensor"; // Importante: importar el navbar de filtro

// Import de las gráficas
import { SensorFlagChart } from "../components/charts/DashboardSensor/SensorFlagChart";
import { BoxTemperatureChart } from "../components/charts/DashboardSensor/BoxTemperatureChart";
import { SamplingChart } from "../components/charts/DashboardSensor/SamplingChart";
import { SensorOperationChart } from "../components/charts/DashboardSensor/SensorOperationChart";

const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentHour = (): number => new Date().getHours();

const getPreviousHour = (): number => {
  const currentHour = new Date().getHours();
  return currentHour > 0 ? currentHour - 1 : 0;
};

function SensorReport(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [startHour, setStartHour] = useState<number>(getPreviousHour());
  const [endHour, setEndHour] = useState<number>(getCurrentHour());

  // 1. Estado para controlar la pestaña/sección activa (por defecto la primera)
  const [activeSection, setActiveSection] = useState<string>("chart-box-temperature");

  const { data, loading, error, availableFiles } = useSensorData(undefined, {
    selectedDate,
    startHour,
    endHour,
  });

  const handleResetFilters = () => {
    setSelectedDate(getCurrentDate());
    setStartHour(getPreviousHour());
    setEndHour(getCurrentHour());
  };

  // 2. Mapeo alineado con los IDs de SECTIONS en NavabarFilterSensor
  const renderActiveChart = () => {
    switch (activeSection) {
      case "chart-box-temperature":
        return <BoxTemperatureChart data={data} />;
      case "chart-sampling":
        return <SamplingChart data={data} />;
      case "chart-flag":
        return <SensorFlagChart data={data} />;
      case "chart-Operation":
        return <SensorOperationChart data={data} />;
      default:
        return <BoxTemperatureChart data={data} />;
    }
  };

  return (
    <>
      <Navbar />

      <main className="sensor-report-container">
        {/* 3. Renderizado del NavabarFilterSensor */}
        <NavabarFilterSensor
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />

        <div className="sensor-report-layout">
          {/* Sidebar Filtros */}
          <DateHourFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            startHour={startHour}
            onStartHourChange={setStartHour}
            endHour={endHour}
            onEndHourChange={setEndHour}
            onReset={handleResetFilters}
            totalReadings={data.length}
            availableFilesCount={availableFiles.length}
          />

          {/* Contenido principal con la gráfica seleccionada */}
          <section className="sensor-report-main-content">
            {error && (
              <div className="sensor-report-status status-error">{error}</div>
            )}

            {loading && data.length === 0 ? (
              <div className="sensor-report-status status-loading">
                Cargando y procesando datos del sensor...
              </div>
            ) : (
              <div className="charts-grid">
                {/* Renderizado dinámico de la gráfica */}
                {renderActiveChart()}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default SensorReport;