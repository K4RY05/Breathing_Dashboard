import React from "react";
import "../../styles/Footer.css";

function Footer(): React.JSX.Element {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-emoji">🫁</span>
          <span>© {new Date().getFullYear()} Respira. Todos los derechos reservados.</span>
        </div>
        <div className="footer-links">
          <a href="#privacidad">Privacidad</a>
          <a href="#terminos">Términos</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;