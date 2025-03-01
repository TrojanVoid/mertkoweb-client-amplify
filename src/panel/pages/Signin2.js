import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import bg1 from "../assets/img/bg1.jpg";

export default function Signin2() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "mertko" && password === "mertko2025_") {
      navigate("/dashboard");
    } else {
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div className="page-sign d-block py-0 panel-wrapper flex justify-center items-center pt-20">
      <Row className="g-0">
        <Col md="7" lg="5" xl="4" className="col-wrapper">
          <Card className="card-sign">
            <Card.Header className="bg-transparent border-0">
              <Link to="/" className="header-logo mb-5 text-white"></Link>
              <Card.Title className="text-white">Giriş Yap</Card.Title>
              <Card.Text className="text-white">
                Hoşgeldiniz! Devam etmek için giriş yapınız.
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Form.Label className="text-white">E-Posta Adresi</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Form.Label className="d-flex justify-content-between text-white">
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="btn-sign">
                  Giriş Yap
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={bg1} className="auth-img" alt="" />
        </Col>
      </Row>
    </div>
  );
}
