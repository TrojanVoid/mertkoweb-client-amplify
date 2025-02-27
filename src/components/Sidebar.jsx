import React, { useState } from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../style/components/sidebar.scss";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* <div className="mobile-header">
        <div className="logo">Logo</div>
        <div className="hamburger" onClick={handleShow}>
          &#9776;
        </div>
      </div> */}

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleClose}>Ana Sayfa</Nav.Link>
            <Nav.Link as={Link} to="/hakkimizda" onClick={handleClose}>Hakkımızda</Nav.Link>
            <Nav.Link as={Link} to="/plastik-urunler" onClick={handleClose}>Plastik Ürünler</Nav.Link>
            <Nav.Link as={Link} to="/pet-urunler" onClick={handleClose}>Pet Ürünler</Nav.Link>
            <Nav.Link as={Link} to="/konsept-urunler" onClick={handleClose}>Konsept Ürünler</Nav.Link>
            <Nav.Link as={Link} to="/iletisim" onClick={handleClose}>İletişim</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;