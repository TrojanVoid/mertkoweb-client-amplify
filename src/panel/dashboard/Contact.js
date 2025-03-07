import React, { useEffect, useState } from "react";
import { Alert, Button, Form, FormGroup } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";

const {Logger, TITLE_TAGS} = require("../../util/Logger");
const {isValidObjectData, isValidPhoneNumber, TimeFormats, isValidHour} = require("../../util/DataValidator");
const {requestByType, types} = require("../../apis/ContactApi");

export default function Contact() {
  ///// Skin Switch /////
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);

  const [contactData, setContactData] = useState({});
  const [newContactData, setNewContactData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");


  const fetchContactData = async() => {
    try {
      const response = await requestByType(types.getContact);
      if(response && response.data ){
        setContactData(response.data);
        setNewContactData(response.data);
      }
      else{
        Logger.error("About data fetch error: Invalid response data", TITLE_TAGS.ABOUT_API);
      }
    } catch (err) {
      console.error("About data fetch error:", err);
    }
  }

  useEffect(() => {
    fetchContactData();
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
    setNewContactData(structuredClone(contactData));
  };
  
  const isWorkingHoursValid = () => {
    Object.entries(newContactData.workingHours).forEach(([key, value]) => {
      if(!key || !value){
        return false;
      }
      Object.entries(value).forEach(([key2, value2]) => {
        if(!key2 || !value2){
          return false;
        }
        if(!isValidHour(value2, TimeFormats.TWENTY_FOUR_HOUR)){
          return false;
        }
      });
    });
    return true;
  }
  
  const save = async () => {
    
    if(!isValidObjectData(newContactData) || !isValidPhoneNumber(newContactData.phone) || !isWorkingHoursValid()){
      setAlertHeading("Başarısız");
      setAlertMessage("Lütfen tüm iletişim bilgisi alanlarını uygun formatta doldurunuz.");
      setAlertVariant("danger");
      window.scrollTo(0, 0);
      navigator.vibrate(200);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }

    const data = structuredClone(newContactData);

    const response = await requestByType(types.updateContact, data);

    if(response?.status === 200){
      setAlertHeading("Başarılı");
      setAlertMessage("İletişim bilgileri başarıyla güncellendi.");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setContactData(structuredClone(newContactData));
    }
    else{
      setAlertHeading("Başarısız");
      setAlertMessage("İletişim bilgileri güncellenirken bir hata oluştu.");
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
                  İletişim Bilgisi Tanımları
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
                Vazgeç
            </Button>

            <Button 
              variant="primary" 
              className="w-[40%] sm:w-[30%] md:w-[15%]"
              onClick={save}
            >
                Kaydet
            </Button>
          </div>

          <h2 className="px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">İletişim Bilgileri</h2>

          <div className="border rounded-lg shadow-md bg-white md:mx-[3rem] mt-[1rem] md:mt-[2rem] mb-4 px-[1rem] md:!px-[0rem] md:pb-4 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out will-change-transform"> 
            <div className="d-flex justify-start items-center w-auto mx-[0rem] md:mx-[3rem] mt-[1rem] md:mt-[2rem] border-b border-gray-100">
              <Form className="w-full">
                <Form.Group className="mb-3">
                  <Form.Label>Adres</Form.Label>
                  <Form.Control 
                    type="text" 
                    id="form-address"
                    value={newContactData.address}
                    onChange={(e) => setNewContactData({...newContactData, address: e.target.value})}
                  />
                </Form.Group>
              </Form>
            </div>

            <div className="d-flex flex-col md:flex-row items-start justify-around w-auto px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">
              
              <div className="d-flex flex-col w-[100%] md:!w-[50%] mt-[1rem] md:!mt-[0rem] pr-0 md:pr-5"> 
                <Form
                  className="d-flex flex-col w-full"
                >
                  <FormGroup className="mb-3">

                    <Form.Label>Telefon Numarası</Form.Label>
                    <Form.Control
                      type="text"
                      id="form-phone"
                      rows={10}
                      value={newContactData.phone}
                      onChange={(e) => setNewContactData({...newContactData, phone: e.target.value})}
                    />

                  </FormGroup>
                </Form>
              </div>

              <div className="d-flex flex-col w-[100%] md:!w-[50%] mt-[1rem] md:!mt-[0rem]"> 
                <Form
                  className="d-flex flex-col w-full"
                >
                  <FormGroup className="mb-3">

                    <Form.Label>E-Posta Adresi</Form.Label>
                    <Form.Control
                      type="email"
                      id="form-email"
                      rows={10}
                      value={newContactData.email}
                      onChange={(e) => setNewContactData({...newContactData, email: e.target.value})}
                    />

                  </FormGroup>
                </Form>
              </div>

            </div>
          </div>
          

          <h2 className="px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">Çalışma Saatleri</h2>

          <div className="flex flex-col md:flex-row gap-4 w-full px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">
            {/* Weekdays */}
            <div className="flex flex-col flex-1 border p-4 rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out will-change-transform">
              <h3 className="text-lg font-semibold mb-2">Hafta İçleri</h3>
              <Form.Group>
                <Form.Label>Açılış Saati</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full"
                  value={newContactData?.workingHours?.weekDays[0]}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        weekDays: [e.target.value, prev.workingHours.weekDays[1]],
                      },
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Kapanış Saati</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full"
                  value={newContactData?.workingHours?.weekDays[1]}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        weekDays: [prev.workingHours.weekDays[0], e.target.value],
                      },
                    }))
                  }
                />
              </Form.Group>
            </div>

            {/* Saturday */}
            <div className="flex flex-col flex-1 border p-4 rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out will-change-transform">
              <h3 className="text-lg font-semibold mb-2">Cumartesi</h3>
              <Form.Group>
                <Form.Label>Açılış Saati</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full"
                  value={newContactData?.workingHours?.saturday[0]}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        saturday: [e.target.value, prev.workingHours.saturday[1]],
                      },
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Kapanış Saati</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full"
                  value={newContactData?.workingHours?.saturday[1]}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        saturday: [prev.workingHours.saturday[0], e.target.value],
                      },
                    }))
                  }
                />
              </Form.Group>
            </div>

            {/* Sunday */}
            <div className="flex flex-col flex-1 border p-4 rounded-lg shadow-md bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out will-change-transform">
              <h3 className="text-lg font-semibold mb-2">Pazar</h3>
              <Form.Group>
                <Form.Label>Açılış Saati</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full"
                  value={newContactData?.workingHours?.sunday[0]}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        sunday: [e.target.value, prev.workingHours.sunday[1]],
                      },
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Kapanış Saati</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full"
                  value={newContactData?.workingHours?.sunday[1]}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      workingHours: {
                        ...prev.workingHours,
                        sunday: [prev.workingHours.sunday[0], e.target.value],
                      },
                    }))
                  }
                />
              </Form.Group>
            </div>
          </div>

          <Footer />
        </div>
      </React.Fragment>
    );
}
