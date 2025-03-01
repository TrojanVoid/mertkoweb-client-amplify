import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import bg1 from "../assets/img/bg1.jpg";

export default function Signin2() {
  return (
    <div className="page-sign flex py-0 panel-wrapper flex justify-between items-center pt-20 h-[100vh]">
      <Row className="g-0 h-full w-full">
        <Col md="7" lg="5" xl="4" className="col-wrapper mt-auto mb-auto">
          <Card className="card-sign ml-auto mr-auto">
          <Card.Header className="bg-transparent border-0">
            <Link to="/" className="header-logo mb-5 text-black-200">MerakliKids</Link>
            <Card.Title className="text-black-200">Giriş Yap</Card.Title>
            <Card.Text className="text-black-200">Hoşgeldiniz! Devam etmek için giriş yapınız.</Card.Text>
          </Card.Header>
            <Card.Body>
              <Form method="get" action="/dashboard/finance">
                <div className="mb-4">
                  <Form.Label className="text-black-200">E-Posta Adresi</Form.Label>
                  <Form.Control type="text" placeholder="Enter your email address" value="me@themepixels.com" />
                </div>
                <div className="mb-4">
                  <Form.Label className="d-flex justify-content-between text-black-200" >
                    Parola       <Link to="">Şifremi Unuttum?</Link>
                  </Form.Label> 
                  <Form.Control type="password" placeholder="Enter your password" value="password123" />     
                </div>
                
                <Button type="submit" className="btn-sign">Giris Yap</Button>
              </Form>
            </Card.Body>
          
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={bg1} className="auth-img" alt="" />
        </Col>
      </Row>
    </div>
  )
}