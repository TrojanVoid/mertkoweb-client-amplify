// HelpdeskService.jsx
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";

export default function HelpdeskService() {
  ///// Skin Switch /////
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);

  const switchSkin = (skin) => {
    if (skin === "dark") {
      const btnWhite = document.getElementsByClassName("btn-white");
      for (const btn of btnWhite) {
        btn.classList.add("btn-outline-primary");
        btn.classList.remove("btn-white");
      }
    } else {
      const btnOutlinePrimary = document.getElementsByClassName("btn-outline-primary");
      for (const btn of btnOutlinePrimary) {
        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-white");
      }
    }
  };

  switchSkin(skin);

  useEffect(() => {
    switchSkin(skin);
  }, [skin]);

  const [soapUrl, setSoapUrl] = useState("http://78.186.167.150:6034/VegaWebService.asmx?wsdl");
  const [adet, setAdet] = useState(5);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/soap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: soapUrl, adet: adet }),
      });
      const data = await res.json();
      setResponseMessage("Response: " + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error sending SOAP request", error);
      setResponseMessage("Error: " + error.message);
    }
  };

  return (
    <React.Fragment>
      <Header onSkin={setSkin} />
      <div className="main main-app p-3 p-lg-4">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="#">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Vega Ayarları
              </li>
            </ol>
            <h4 className="main-title mb-0 mt-2">Vega Ayarları</h4>
          </div>
        </div>

        {/* SOAP isteği için form */}
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formSoapUrl" className="mb-3">
                <Form.Label className="text-white">URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Vega WebServis URL"
                  value={soapUrl}
                  onChange={(e) => setSoapUrl(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formAdet" className="mb-3">
                <Form.Label className="text-white">Adet (min)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Adet"
                  value={adet}
                  onChange={(e) => setAdet(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Kaydet
              </Button>
            </Form>
            {responseMessage && (
              <pre className="mt-3">{responseMessage}</pre>
            )}
          </Card.Body>
        </Card>

        <Footer />
      </div>
    </React.Fragment>
  );
}
