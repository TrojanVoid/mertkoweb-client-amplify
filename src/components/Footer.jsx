import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import "../style/components/old-footer.scss";

const Footer = () => {
  return (
    <footer className="footer d-flex w-100 justify-content-center align-items-center">
      <Container className="footer-wrapper w-75 d-flex justify-content-between align-items-center">
        <Container className="d-flex flex-column justify-content-center align-items-start">
          
          <span>Tel: 
            <a href="tel:+90 212 223 05 01">{" +90 212 223 05 01"}</a>
          </span>
          <span>
            E-posta: 
            <a href="mailto:mertko@mertko.com" className="footer-email-link">
              {" mertko@mertko.com"}
            </a>
          </span>
          
        </Container>

        <Container className="d-flex justify-content-end align-items-end">
          <span className="d-flex justify-content-center align-items-center text-align-center">
            {"© Telif Hakkı - "}
            <Nav.Link id="footer-homepage-link" as={Link} to="/contact">
                {" Mertko Plastik"}
            </Nav.Link>
          </span>
        </Container>  
      </Container>
    </footer>
  );
};

export default Footer;
