import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import "../style/components/Header.scss";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; 

const Header = ({ activeTabIndex = 0 }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.15) {
        setIsMinimized(true);
      } else {
        setIsMinimized(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (e) => {
      if (isSidePanelOpen && !e.target.closest('.side-panel') && !e.target.closest('.navbar-toggler')) {
        setIsSidePanelOpen(false);
      }
    };
    
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isSidePanelOpen]);

  return (
    <Navbar className={`header ${isMinimized ? 'minimized' : ''} d-flex flex-column justify-content-center align-items-center` } expand="lg">
      <div className="small-navbar w-100 d-flex flex-row-reverse justify-content-start align-items-center">
        <a href="tel:+902122230501" >
          <span className="small-link">Tel: +90 212 223 05 01</span></a>
        <a href="mailto:mertko@mertko.com" className="footer-email-link">
          <span className="small-link">E-posta: mertko@mertko.com</span>
        </a>
      </div>

      <Container className="large-navbar d-flex justify-content-between align-items-center">
        <Navbar.Brand className="logo">
          <HashLink as={Link} className="logo-link" to="/#home">
            <img src="/resources/images/mertko_logo-300x117.png" alt="Logo" className="logo-image" />
          </HashLink>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="d-lg-none navbar-toggler" 
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} 
        />
        
        <div className={`side-panel ${isSidePanelOpen ? 'open' : ''}`}>
          <Nav className="navbar-container">
            <HashLink className={activeTabIndex === 0 ? "active" : ""} as={Link} to="/#home">Ana Sayfa</HashLink>
            <HashLink className={activeTabIndex === 1 ? "active" : ""} to="/#about">Hakkımızda</HashLink>
            <Dropdown onToggle={(isOpen) => setDropdownOpen(isOpen)}>
              <Dropdown.Toggle variant="link" className={activeTabIndex === 2 ? "active" : ""}>
                Ürünler {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/products/bottles">Şişeler</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/jars">Kavanozlar</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/concept">Konsept Ürünler</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <HashLink className={activeTabIndex === 3 ? "active" : ""} as={Link} to="/#contact">İletişim</HashLink>
          </Nav>
        </div>

        <div className="d-lg-flex justify-content-between header-links-large">
          <Nav className="navbar-container w-100 ml-auto d-flex justify-content-between">
            <HashLink className={activeTabIndex === 0 ? "active" : ""} as={Link} to="/#home">Ana Sayfa</HashLink>
            <HashLink className={activeTabIndex === 1 ? "active" : ""} to="/#about">Hakkımızda</HashLink>
            <Dropdown onToggle={(isOpen) => setDropdownOpen(isOpen)}>
              <Dropdown.Toggle variant="link" className={activeTabIndex === 2 ? "active" : ""}>
                Ürünler {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/products/sise">Şişeler</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/kavanoz">Kavanozlar</Dropdown.Item>
                <Dropdown.Item as={Link} to="/products/konsept">Konsept Ürünler</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <HashLink className={activeTabIndex === 3 ? "active" : ""} as={Link} to="/#contact">İletişim</HashLink>
          </Nav>
        </div>
        
      </Container>
    </Navbar>
  );
};

export default Header;
