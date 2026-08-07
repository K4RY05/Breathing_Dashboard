import React from "react";
import "../../styles/DateHourFilter.css";

interface DateHourFilterProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  startHour: number;
  onStartHourChange: (hour: number) => void;
  endHour: number;
  onEndHourChange: (hour: number) => void;
  onReset: () => void;
  totalReadings?: number;
  availableFilesCount?: number;
}

const hoursArray = Array.from({ length: 24 }, (_, i) => i);

export const DateHourFilter: React.FC<DateHourFilterProps> = ({
  selectedDate,
  onDateChange,
  startHour,
  onStartHourChange,
  endHour,
  onEndHourChange,
  onReset,
  totalReadings = 0,
  availableFilesCount = 0,
}) => {
  return (
    <aside className="dashboard-filters-sidebar">
      <div className="filter-sidebar-header">
        <h3 className="filter-sidebar-title">Filtros</h3>
        <p className="filter-siderbar-subtitle">Filtra la información por día y rango de horario.</p>
      </div>

      {/* Filtro de Día */}
      <div className="filter-item">
        <label htmlFor="filter-date">Día</label>
        <input
          id="filter-date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Filtro Hora Inicio */}
      <div className="filter-item">
        <label htmlFor="start-hour">Hora Inicio</label>
        <select
          id="start-hour"
          value={startHour}
          onChange={(e) => onStartHourChange(Number(e.target.value))}
          className="filter-select"
        >
          {hoursArray.map((h) => (
            <option key={`start-${h}`} value={h}>
              {String(h).padStart(2, "0")}:00 hrs
            </option>
          ))}
        </select>
      </div>

      {/* Filtro Hora Fin */}
      <div className="filter-item">
        <label htmlFor="end-hour">Hora Fin</label>
        <select
          id="end-hour"
          value={endHour}
          onChange={(e) => onEndHourChange(Number(e.target.value))}
          className="filter-select"
        >
          {hoursArray.map((h) => (
            <option key={`end-${h}`} value={h}>
              {String(h).padStart(2, "0")}:59 hrs
            </option>
          ))}
        </select>
      </div>

      {/* Botón Restablecer */}
      <div className="filter-item filter-actions">
        <button
          onClick={onReset}
          className="btn-clear-filters"
          type="button"
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Info discreta de lecturas (Abajo del filtro) */}
      <div className="filter-sidebar-footer">
        <span className="filter-info-text">
          <strong>{totalReadings}</strong> lecturas filtradas
        </span>
        {availableFilesCount > 0 && (
          <span className="filter-files-count">
            {availableFilesCount} archivos
          </span>
        )}
      </div>
    </aside>
  );
};