import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

function Footer(): React.JSX.Element {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-emoji">🫁</span>
          <span>
            © {new Date().getFullYear()} Respira. Todos los derechos reservados.
          </span>
        </div>

        <div className="footer-links">
          <Link to="/privacy">Privacidad</Link>
          <Link to="/terms">Términos</Link>
          <Link to="/contact">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;