import React from 'react';
import '../../styles/NavabarFilter.css';
import type { ChartSection, NavabarFilterProps } from '../../types/sensorData';

const SECTIONS: ChartSection[] = [
  { id: 'chart-box-temperature', label: 'Teperatura del Sensor' },
  { id: 'chart-sampling', label: 'Clima' },
  { id: 'chart-flag', label: 'Partículas' },
  { id: 'chart-Operation', label: 'Viento' }
];

export const NavabarFilterSensor: React.FC<NavabarFilterProps> =({
    activeSection,
    onSelectSection,
})=>{
    return(
        <nav className="navbar-filter-pill">
      {/* Navegación central por pestañas */}
      <ul className="pill-menu">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <button
              className={`pill-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onSelectSection(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
    );
};