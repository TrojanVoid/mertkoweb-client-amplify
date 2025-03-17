import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import bg1 from "../assets/img/bg1.jpg";
import { login } from "../../apis/LoginApi";
import { UserContext } from "../context/UserContext";

export default function Signin2() {
  const location = useLocation();
  const willSignOut = location.state?.willSignOut;

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (willSignOut) {
      localStorage.removeItem('user');
      setUser({ username: null });
    }
  }, [willSignOut, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.status === 200) {
        const expirationTime = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 saat
        const userData = { username, expirationTime };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); 
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
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kullanıcı Adınızı Giriniz..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Form.Label>Parola</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Parolanızı Giriniz..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="btn-sign">Giriş Yap</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={bg1} className="w-full h-full object-cover" alt="" />
        </Col>
      </Row>
    </div>
  );
}
