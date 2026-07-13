import "../styles/Home.css";
import Navbar from "../components/layout/Navbar.tsx";
import Footer from "../components/layout/Footer.tsx";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Navbar />
      <main className="main-content">

        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-content">
              <h1 className="main-title">
                Proyecto <span className="text-3d">RESPIRA</span>
              </h1>

              <p className="main-subtitle">
                Una iniciativa estratégica para fortalecer la salud respiratoria y la sostenibilidad ambiental en los municipios urbanos y periurbanos del estado de Puebla.
              </p>

              <div className="hero-actions">
                <button className="btn-primary" onClick={() => navigate("/dashboard")}>Ver Indicadores </button>

                <button
                  className="btn-secondary"
                  onClick={() => navigate("/sensor-report")}
                >
                  Sensores
                </button>
              </div>
            </div>
            
            <div className="hero-visual-panel">
              <div className="visual-card">
                <div className="visual-card-header">
                  <span className="status-indicator-dot"></span>
                  <span className="visual-card-title">Red de Monitoreo Activa</span>
                </div>
                <div className="visual-data-mock">
                  <div className="data-line long"></div>
                  <div className="data-line short"></div>
                  <div className="data-bar-container">
                    <div className="data-bar progress-1"></div>
                    <div className="data-bar progress-2"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="description-section">
          <div className="container grid-layout">

            {/* Tarjeta 1: Plataforma e Inteligencia */}
            <div className="info-card highlight">
              <span className="card-category">Estrategia</span>
              <h3>Plataforma Estatal</h3>
              <p>
                Creación de una plataforma estatal de <strong>inteligencia ambiental, sanitaria y educativa</strong> para el monitoreo integral.
              </p>
            </div>

            {/* Tarjeta 2: Integración Tecnológica */}
            <div className="info-card highlight">
              <span className="card-category">Infraestructura</span>
              <h3>Tecnología e Integración</h3>
              <p>
                Integración de <strong>sensores de bajo costo</strong> y tecnología abierta internacional
                (<span className="tech-tag">Respira Limpio / qAIRa</span>) combinada con desarrollos nacionales del IPN
                (<span className="tech-tag">CLAIRE Sinaloa</span> y <span className="tech-tag">SB QUANTAC</span>).
              </p>
              <span className="card-footer-text">Monitoreo de calidad del aire y alertas tempranas ante contaminantes críticos.</span>
            </div>

            {/* Tarjeta 3: Impacto y Educación */}
            <div className="info-card highlight">
              <span className="card-category">Impacto Social</span>
              <h3>Acción y Educación</h3>
              <p>
                Correlación de niveles de contaminación con indicadores de salud, canalización a servicios médicos locales y promoción de una <strong>educación ambiental activa</strong> mediante módulos STEAM y herramientas digitales.
              </p>
            </div>

          </div>
        </section>

        {/* Sección de las Redes Colaboradoras */}
        <section className="networks-section">
          <div className="container">
            <h2 className="section-title">Redes Politécnicas Participantes</h2>
            <div className="networks-grid">
              <div className="network-item">
                <p className="network-name">Red de Computación</p>
              </div>
              <div className="network-item">
                <p className="network-name">REMA (Red de Medio Ambiente)</p>
              </div>
              <div className="network-item">
                <p className="network-name">Red de Desarrollo Económico</p>
              </div>
              <div className="network-item">
                <p className="network-name">Red de Salud</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;