import React, { useState } from "react";
import "../styles/Dashboard.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useSensorData } from "../hooks/useSensorData";
import { AirQualityChart } from "../components/charts/DashboardMeasurements/AirQualityChart";
import { DateHourFilter } from "../components/layout/DateHourFilter";

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

function Dashboard(): React.JSX.Element {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [startHour, setStartHour] = useState<number>(getPreviousHour());
  const [endHour, setEndHour] = useState<number>(getCurrentHour());

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

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard de Mediciones del Sensor</h1>
        </header>

    <div className="dashboard-layout">
  {/* Filtro Sidebar con la info discreta integrada abajo */}
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

  {/* Contenido principal (Gráficas) */}
  <section className="dashboard-main-content">
    {error && <div className="dashboard-status status-error">{error}</div>}

    {loading && data.length === 0 ? (
      <div className="dashboard-status status-loading">
        Cargando y procesando datos del sensor...
      </div>
    ) : (
      <div className="charts-grid">
        <AirQualityChart data={data} />
      </div>
    )}
  </section>
</div>      </main>

      <Footer />
    </>
  );
}

export default Dashboard;