import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "../style/components/Contact.scss";

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => { // TODO Send contact information to the server via API and then send notification e-mail from the server
    e.preventDefault();
    
    console.log('Contact Information:', contactInfo);
  };

  return (
    <Container fluid className="contact-page mt-5 d-flex flex-column justify-content-center align-items-center">
      
      <Row className="map-container mb-5">
        <Col>
          <iframe
            title="Company Location"
            src="https://maps.google.com/maps?q=Mertko+Plastik+Ürünleri+San.Tic.Ltd.Şti.&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Col>
      </Row>

      <Row className="contact-address-container d-flex justify-content-between align-items-start">
        <Col className="contact-form-container" md={6}>
          <h2>Bizimle İletişime Geçin</h2>
          <Form id="contact" onSubmit={handleSubmit}>
            <Row className="w-100 d-flex justify-content-between align-items-center">
                <Form.Group controlId="formFullName" className="mb-3 w-48">
                
                    <Form.Label>İsim</Form.Label>
                    <Form.Control
                    type="text"
                    name="fullName"
                    value={contactInfo.fullName}
                    onChange={handleInputChange}
                    required
                    />
                </Form.Group>
  
                <Form.Group controlId="formEmail" className="mb-3 w-48">
                    <Form.Label>E-posta Adresi</Form.Label>
                    <Form.Control
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleInputChange}
                    required
                    />
                </Form.Group>
            </Row>
            

            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={contactInfo.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMessage" className="mb-3">
              <Form.Label>Mesaj</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={contactInfo.message}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Gönder
            </Button>
          </Form>
        </Col>

        <Col className="address-container" md={6}>
          <h2>Adresimiz</h2>
          <Row>
            <Col>
              <p>Gümüşsuyu Caddesi</p>
              <p>Ceyhan İş Merkezi</p>
              <p>No:17 / 42</p>
              <p>Topkapı-Maltepe</p>
              <p>İstanbul</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
