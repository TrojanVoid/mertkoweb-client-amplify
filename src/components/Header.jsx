import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import "../style/components/Header.scss";


const Header = ({activeTabIndex=0}) => {

  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.15) { 
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar className={`header ${isMinimized ? 'minimized' : ''} d-flex flex-column justify-content-center align-items-center` } expand="lg">
      <div className="small-navbar w-100 d-flex flex-row-reverse justify-content-start align-items-center">
        <a href="tel:+902122230501" >
          <span className="small-link">Tel: +90 212 223 05 01</span></a>
        <a href="mailto:mertko@mertko.com" className="footer-email-link">
          <span className="small-link">E-posta: mertko@mertko.com</span>
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
            <HashLink className={activeTabIndex == 0 ? "active" : null} as={Link} to="/#home">Ana Sayfa</HashLink>
            <HashLink className={activeTabIndex == 1 ? "active" : null} to="/#about">Hakkımızda</HashLink>            
            <Nav.Link className={activeTabIndex == 2 ? "active" : null} as={Link} to="/products">Ürünler</Nav.Link>
            <HashLink className={activeTabIndex == 3 ? "active" : null} as={Link} to="/#contact">İletişim</HashLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;