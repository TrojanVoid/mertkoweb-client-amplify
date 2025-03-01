import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import bg1 from "../assets/img/bg1.jpg";
import {login} from "../../apis/LoginApi";

  

export default function Signin2() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.status === 200) {
        navigate("/dashboard");
      } else {
        alert("Giriş başarısız, lütfen bilgilerinizi kontrol ediniz.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş başarısız: " + (error.response?.data?.error || error.message));
    }
  };


  return (
    <div className="page-sign flex py-0 panel-wrapper flex justify-between items-center pt-20 h-[100vh]">
      <Row className="g-0 h-full w-full">
        <Col md="7" lg="5" xl="4" className="col-wrapper mt-auto mb-auto">
          <Card className="card-sign ml-auto mr-auto">
          <Card.Header className="bg-transparent border-0">
            <Link to="/" className="header-logo mb-5 text-black-200">Mertko</Link>
            <Card.Title className="text-black-200">Giriş Yap</Card.Title>
            <Card.Text className="text-black-200">Hoşgeldiniz! Devam etmek için giriş yapınız.</Card.Text>
          </Card.Header>
            <Card.Body>
            <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                <Form.Label className="">Kullanıcı Adı</Form.Label>
                <Form.Control
                type="text"
                placeholder="Kullanıcı Adınızı Giriniz..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div className="mb-4">
                  <Form.Label className="d-flex justify-content-between text-black-200" >
                    Parola 
                  </Form.Label> 
                  <Form.Control
                  type="password"
                  placeholder="Parolanızı Giriniz..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    />     
                </div>

                <Button type="submit" className="btn-sign">Giris Yap</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={bg1} className="w-full h-full object-cover" alt="" />
        </Col>
      </Row>
    </div>
  )
}