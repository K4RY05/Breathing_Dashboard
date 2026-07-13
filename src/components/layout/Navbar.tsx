import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Navbar.css";

function Navbar(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = (): void => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="home-header">
      <div className="header-left">
         <Link to="/" className="brand-logo" aria-label="Respira Inicio">
          <div className="logo-icon-wrapper">
            <span className="logo-emoji" aria-hidden="true">🫁</span>
          </div>
          <span className="brand-name">Respira</span>
         </Link>
        <nav className="header-nav" aria-label="Navegación principal">
         <Link to="/" className="nav-item">Inicio</Link>
         <Link to="/dashboard" className="nav-item">Dashboard</Link>
         <Link to="/sensor-report" className="nav-item">Reporte de sensores</Link>
        </nav>
      </div>
      
      <div className="header-right">
        <button 
          className={isDarkMode ? "btn-theme-toggle dark" : "btn-theme-toggle light"}
          onClick={toggleTheme}
        >
          <span className="toggle-icon">{isDarkMode ? "☀️" : "🌙"}</span>
             <span className="toggle-text">
            {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;