// HelpdeskService.jsx
import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Form, FormGroup } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";

const {requestByType, types} = require("../../apis/AboutApi");

export default function About() {
  ///// Skin Switch /////
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);

  const [aboutData, setAboutData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [title, setTitle] = useState("");

  const fetchAboutData = async() => {
    try {
      const response = await requestByType(types.getAbout);
      setAboutData(response.data);
      if(response.data && response.data.content1 && response.data.content2){
        setContent1(response.data.content1);
        setContent2(response.data.content2);
      }
      if(response.data.title){
        setTitle(response.data.title);
      }
    } catch (err) {
      console.error("About data fetch error:", err);
    }
  }

  useEffect(() => {
    fetchAboutData();
  }, []);

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


  const resetToConfigValue = () => {
    setContent1(aboutData.content1);
    setContent2(aboutData.content2);
    setTitle(aboutData.title);
    document.getElementById("form-content1").value = aboutData.content1;
    document.getElementById("form-content2").value = aboutData.content2;
    document.getElementById("form-title").value = aboutData.title;
  };
  
  const save = async () => {
    const data = {
      title: title,
      content1: content1,
      content2: content2,
    };
    const response = await requestByType(types.updateAbout, data);

    if(response?.status === 200){
      console.log("alert test");
      setAlertHeading("Başarılı");
      setAlertMessage("HAKKIMIZDA içeriği başarıyla güncellendi.");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    else{
      setAlertHeading("Başarısız");
      setAlertMessage("HAKKIMIZDA içeriği güncellenirken bir hata oluştu.");
      setAlertVariant("danger");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }

  };

  return (
    <React.Fragment>
      <Header onSkin={setSkin} />
      <div className="main main-app p-3 p-lg-4">
        <Alert show={showAlert} variant={alertVariant}>
          <Alert.Heading>
            {alertHeading}
          </Alert.Heading>
          <p>
            {alertMessage}
          </p>
          <hr />
        </Alert>

        <div className="d-md-flex align-items-center justify-content-between mb-4">

          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="/panel">Panel</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
               Hakkımızda
              </li>
            </ol>
          </div>
        </div>

        <div className="d-flex justify-around md:justify-end items-center w-auto mx-[0rem] md:mx-[3rem] my-2 py-2 bg-gray-300 rounded-lg px-3">
          <Button 
            variant="outline-primary" 
            className="btn-white me-[1%] sm:!me-[2rem] w-[40%] sm:w-[30%] md:w-[15%]"
            onClick={resetToConfigValue}
            >
              Geri Al
          </Button>

          <Button 
            variant="primary" 
            className="w-[40%] sm:w-[30%] md:w-[15%]"
            onClick={save}
          >
              Kaydet
          </Button>
        </div>

        <div className="d-flex justify-start items-center w-auto mx-[0rem] md:mx-[3rem] mt-[3rem] md:mt-[2rem] border-b border-gray-100">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Başlık</Form.Label>
              <Form.Control 
                type="text" 
                id="form-title"
                defaultValue={aboutData.title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Form>
        </div>

        <div className="d-flex flex-col md:flex-row items-start justify-around w-auto px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">
          
          <div className="d-flex flex-col w-[100%] md:!w-[50%] mt-[3rem] md:!mt-[0rem] pr-0 md:pr-5"> 
            <Form
              className="d-flex flex-col w-full"
            >
              <FormGroup className="mb-3">

                <Form.Label>Birinci Paragraf</Form.Label>
                <Form.Control
                  id="form-content1"
                  as="textarea"
                  rows={10}
                  defaultValue={aboutData.content1}
                  onChange={(e) => setContent1(e.target.value)}
                />

              </FormGroup>
            </Form>
          </div>

          <div className="d-flex flex-col w-[100%] md:!w-[50%] mt-[3rem] md:!mt-[0rem]"> 
            <Form
              className="d-flex flex-col w-full"
            >
              <FormGroup className="mb-3">

                <Form.Label>İkinci Paragraf</Form.Label>
                <Form.Control
                  id="form-content2"
                  as="textarea"
                  rows={10}
                  defaultValue={aboutData.content2}
                  onChange={(e) => setContent2(e.target.value)}
                />

              </FormGroup>
            </Form>
          </div>

        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
}
