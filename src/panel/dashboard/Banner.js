import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Form, FormGroup } from "react-bootstrap";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";

const {requestByType, types} = require("../../apis/BannerApi");

export default function HelpdeskService() {
  ///// Skin Switch /////
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);
  const [bannerData, setBannerData] = useState([]);
  const [newBannerData, setNewBannerData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const fetchBannerData = async() => {
    try {
      const response = await requestByType(types.getBanner);
      setBannerData(response.data);
      setNewBannerData(response.data);
    } catch (err) {
      console.error("Banner data fetch error:", err);
    }
  }

  useEffect(() => {
    fetchBannerData();
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
    setNewBannerData(bannerData);
  };

  const save = async () => {
    for(let i=0; i<newBannerData.length; i++){
      if(newBannerData[i] === ""){
        navigator.vibrate(200);
        window.scrollTo(0, 0);
        setAlertVariant("danger");
        setAlertHeading("Hata");
        setAlertMessage("Boş içerik kayıt edemezsiniz. Lütfen boş olan içerikleri doldurun veya çıkarın.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
        return;
      }
    }
    try {
      console.log("sending new banner data:", newBannerData)
      const response = await requestByType(types.updateBanner, newBannerData);
      if(response.status === 200){
        setAlertVariant("success");
        setAlertHeading("Başarılı");
        setAlertMessage("Banner verileri güncellendi.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        setAlertVariant("danger");
        setAlertHeading("Hata");
        setAlertMessage("Banner verileri güncellenemedi.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Banner data update error:", err);
      setAlertVariant("danger");
      setAlertHeading("Hata");
      setAlertMessage("Banner verileri güncellenemedi.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    window.scrollTo(0, 0);
  };

  const addNewContent = () => {
    if( newBannerData.length > 0 && newBannerData[newBannerData.length-1] === ""){
      navigator.vibrate(200);
      window.scrollTo(0, 0);
      setAlertVariant("danger");
      setAlertHeading("Hata");
      setAlertMessage("Yeni içerik eklemeden önce lütfen önceki içeriği doldurun.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }
    setNewBannerData([...newBannerData, ""]);
  }

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
                  Banner Tanımları
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
          
          <h1 className="text-start mt-4 pl-[0rem] md:pl-[3rem]">
            İçerikler
          </h1>
  
          <div className="d-flex flex-col items-start justify-start w-auto px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">
            
            {newBannerData.map((item, index) => {
              return <>
                <div className="d-flex flex-row justify-between align-center w-[100%] mt-[3rem] md:!mt-[0rem] pr-0 md:pr-5"> 

                  <Form className="w-full">
                    <Form.Group className="mb-3 w-full">
                      <div className="d-flex w-full justify-between items-center">
                        <Form.Label>{`${index+1}. İçerik`}</Form.Label>
                        <div className="d-flex flex-row justify-end items-center">
                          {index > 0 && (
                            <Button 
                              variant="outline-primary" 
                              className="btn-white flex justify-center items-center w-[40%] sm:w-[30%] md:w-[15%] p-0 border-0 !me-[1rem] sm:!me-[1rem]"
                              onClick={() => {
                                const temp = [...newBannerData];
                                const swap = temp[index];
                                temp[index] = temp[index-1];
                                temp[index-1] = swap;
                                setNewBannerData(temp);
                              }}
                            >
                              <Icon.CaretUp className="text-black" size={16} />
                            </Button>
                          )}
                          {index < newBannerData.length-1 && (
                            <Button 
                              variant="outline-primary" 
                              className="btn-white me-[3%] sm:!me-[5%] w-[40%] sm:w-[30%] md:w-[15%] p-0 border-0 !me-[1rem] sm:!me-[1rem]"
                              onClick={() => {
                                const temp = [...newBannerData];
                                const swap = temp[index];
                                temp[index] = temp[index+1];
                                temp[index+1] = swap;
                                setNewBannerData(temp);
                              }}
                            >
                              <Icon.CaretDown className="text-black" size={16} />
                            </Button>
                          )}
                          <Button 
                            variant="outline-danger" 
                            className={`btn-white w-[40%] sm:w-[30%] md:w-[15%] h-auto p-0 border-0 ` + `${(index === 0 || index === newBannerData.length-1) ? "!me-[0.6rem]" : "!me-[0.38rem]"}`}
                            onClick={() => {
                              const temp = [...newBannerData];
                              temp.splice(index, 1);
                              setNewBannerData(temp);
                            }}
                          >
                            <Icon.Trash className="text-red transition-colors duration-200 group-hover:!text-red-100" size={16} />
                          </Button>
                        </div>
                      </div>

                      <Form.Control 
                        type="text" 
                        id={`form-content-${index}`}
                        value={item}
                        onChange={(e) => {
                          const temp = [...newBannerData];
                          temp[index] = e.target.value;
                          setNewBannerData(temp);
                        }}
                      />
                    </Form.Group>
                    
                  </Form>

                  
                </div>
              </>
            })}
  
            <div className="d-flex flex-row w-full justify-center md:justify-end items-center mt-3 px-3">
              <Button 
                variant="primary" 
                className="w-[80%] sm:w-[35%] md:w-[25%]"
                onClick={addNewContent} 
              >
                <span className="text-md">
                  Yeni İçerik Ekle
                </span>
              </Button>
            </div>
          </div>
  
          <Footer />
        </div>
      </React.Fragment>
    );
}
