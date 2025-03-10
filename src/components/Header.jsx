import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import "../style/components/old-header.scss";

const Header = ({ activeTabIndex = 0 }) => {
  const [headerScript, setHeaderScript] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_BASE}/get-meta-data`)
      .then(res => res.json())
      .then(data => {
        console.log("Header meta data fetched: ", data);
        if (data && data.headerScript) {
          setHeaderScript(data.headerScript);
        }
      })
      .catch(err => console.error("Error fetching header meta data", err));
  }, [API_BASE]);

  useEffect(() => {
    if (headerScript) {
      console.log("Header script to be applied: ", headerScript);
    }
  }, [headerScript]);

  return (
    <>
      <Helmet>
        {/* Inline script'in çalışmasını sağlamak için dangerouslySetInnerHTML kullanıyoruz */}
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: headerScript }} />
      </Helmet>
      <Navbar className="header d-flex flex-column justify-content-center align-items-center" expand="lg">
        <div className="small-navbar w-100 d-flex flex-row-reverse justify-content-start align-items-center">
          <a href="tel:+902122230501">Tel: +90 212 223 05 01</a>
          <a href="mailto:mertko@mertko.com" className="footer-email-link">
            E-posta: mertko@mertko.com
          </a>
        </div>
        <Container className="large-navbar d-flex justify-content-center align-items-center">
          <Navbar.Brand className="logo">
            <HashLink as={Link} className="logo-link" to="/#home">
              <img src="/resources/images/mertko_logo-300x117.png" alt="Logo" className="logo-image" />
            </HashLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-lg-none" />
          <Navbar.Collapse className="d-lg-flex flex-row-reverse justify-content-between" id="basic-navbar-nav">
            <Nav className="navbar-container ml-auto d-lg-flex justify-content-between">
              <HashLink className={activeTabIndex === 0 ? "active" : ""} as={Link} to="/#home">Ana Sayfa</HashLink>
              <HashLink className={activeTabIndex === 1 ? "active" : ""} to="/#about">Hakkımızda</HashLink>            
              <Nav.Link className={activeTabIndex === 2 ? "active" : ""} as={Link} to="/products">Ürünler</Nav.Link>
              <HashLink className={activeTabIndex === 3 ? "active" : ""} as={Link} to="/#contact">İletişim</HashLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
