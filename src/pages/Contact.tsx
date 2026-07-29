import "../styles/Contact.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Contact() {
  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <section className="description-section">
          {/* Encabezado con Avatar */}
          <header className="contact-header">
            <div className="avatar-container">
              <img
                src=""
                alt="Atención al cliente"
                className="avatar-image"
              />
            </div>
            <h1 className="contact-title">Contáctenos</h1>
            <p className="contact-description">
              Utilice la información de contacto a continuación para comunicarse directamente con nosotros o conocer nuestras áreas de atención.
            </p>
          </header>

          {/* Grid Layout */}
          <div className="grid-layout">
            <article className="info-card highlight">
              <span className="card-category">Información</span>
              <h3>Dra. Claudia Marina Vicario Solórzano</h3>
              <p>
                Laboratorio de Informática Educativa de la UPIICSA-IPN, ubicado en el edificio de la Sección de Estudios de Posgrado e Investigación (SEPI).
              </p>
            </article>

            <article className="info-card highlight">
              <span className="card-category">Atención Directa</span>
              <h3>Red IPN</h3>
              <p>
                 Extensión 70511<br />
              </p>
                   <h3>WhatsApp</h3>
              <p>
                 +52 (55) 5106-1067<br />
              </p>
                   <h3>Correo institucional</h3>
              <p>
                 cvicario@ipn.mx<br />
              </p>
            </article>

            <article className="info-card highlight">
              <span className="card-category">Laboratorio de Informática Educativa</span>
              <h3>Ubicación del Laboratorio de Informática Educativa</h3>
              <p>
                Calle de Té 950, Colonia Granjas México, C.P. 08400, Alcaldía Iztacalco, Ciudad de México.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;