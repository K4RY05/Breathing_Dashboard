import React from "react";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Barra de Navegación Superior (Estilo Zenkit) */}
      <header className="home-header">
        <div className="header-left">
          <div className="brand-logo">
            <span className="logo-emoji">🫁</span>
            <strong>Respira Suite</strong>
          </div>
          <nav className="header-nav">
            <a href="#productos" className="nav-item">Productos ▾</a>
            <a href="#soluciones" className="nav-item">Soluciones</a>
            <a href="#precios" className="nav-item">Precios</a>
          </nav>
        </div>
        <div className="header-right">
          <a href="#demo" className="nav-link-demo">Consigue una Demo</a>
          <a href="#login" className="nav-link-login">Inicia sesión ▾</a>
          <button className="btn-register">Regístrate gratis ▾</button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="home-main">
        
        {/* Sección Hero */}
        <section className="hero">
          <h1 className="hero-title">Productividad para Equipos Felices</h1>
          <p className="hero-subtitle">
            La suite de software de productividad enfocada a un flujo de trabajo natural
            para el monitoreo inteligente de la respiración.
          </p>
        </section>

        {/* Sección de Tarjetas (Features) */}
        <section className="features-grid">
          
          {/* Tarjeta 1: Dashboard / Projects */}
          <div className="zen-card card-purple">
            <div className="card-header">
              <span className="card-icon">📊</span>
              <div className="card-header-text">
                <h3>Dashboard</h3>
                <p>Gestión de proyectos para equipos de proyectos exitosos</p>
              </div>
            </div>
            <div className="card-body">
              <div className="graphic-blob blob-purple"></div>
              <div className="center-icon icon-purple">
                <span>📊</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Sensores / Zenforms */}
          <div className="zen-card card-green">
            <div className="card-header">
              <span className="card-icon">📋</span>
              <div className="card-header-text">
                <h3>Sensores</h3>
                <p>Formularios, encuestas y estado de los dispositivos</p>
              </div>
            </div>
            <div className="card-body">
              <div className="graphic-blob blob-green"></div>
              <div className="center-icon icon-green">
                <span>📋</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Reportes / Zenchat */}
          <div className="zen-card card-blue">
            <div className="card-header">
              <span className="card-icon">💬</span>
              <div className="card-header-text">
                <h3>Reportes</h3>
                <p>Chat + Tareas = Magia e historial de datos analíticos</p>
              </div>
            </div>
            <div className="card-body">
              <div className="graphic-blob blob-blue"></div>
              <div className="center-icon icon-blue">
                <span>✅</span>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Home;