import React, { useState } from "react";
import "../styles/Dashboard.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { NavabarFilter } from "../components/layout/NavabarFilter"; 
import { useSensorData } from "../hooks/useSensorData";
import { DateHourFilter } from "../components/layout/DateHourFilter";


import { AirQualityChart } from "../components/charts/DashboardMeasurements/AirQualityChart";
import { ClimateChart } from "../components/charts/DashboardMeasurements/ClimateChart";
import { ParticlesChart } from "../components/charts/DashboardMeasurements/ParticlesChart";
import { WindChart } from "../components/charts/DashboardMeasurements/WindChart";
import { WeatherChart } from "../components/charts/DashboardMeasurements/WeatherChart";

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

  // Estado para controlar qué gráfica mostrar
  const [activeSection, setActiveSection] = useState<string>("chart-air-quality");

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

  // Función para renderizar la gráfica seleccionada
  const renderActiveChart = () => {
    switch (activeSection) {
      case "chart-air-quality":
        return <AirQualityChart data={data} />;
      case "chart-climate":
        return <ClimateChart data={data} />;
      case "chart-particles":
        return <ParticlesChart data={data} />;
      case "chart-wind":
        return <WindChart data={data} />;
      case "chart-weather":
        return <WeatherChart data={data} />;
      default:
        return <AirQualityChart data={data} />;
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        {/* Pasamos el estado y la función para cambiarlo */}
        <NavabarFilter 
          activeSection={activeSection} 
          onSelectSection={setActiveSection} 
        />

        <div className="dashboard-layout">
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

          {/* Contenido principal (Renderizado condicional) */}
          <section className="dashboard-main-content">
            {error && <div className="dashboard-status status-error">{error}</div>}

            {loading && data.length === 0 ? (
              <div className="dashboard-status status-loading">
                Cargando y procesando datos del sensor...
              </div>
            ) : (
              <div className="single-chart-view">
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

export default Dashboard;