import React, { useEffect, useState } from "react";
import { Alert, Button, Form, FormGroup } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";

const {Logger, TITLE_TAGS} = require("../../util/Logger");
const {requestByType, types} = require("../../apis/MetaApi");

export default function Meta() {
  ///// Skin Switch /////
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);

  const [titlePrefix, setTitlePrefix] = useState("");
  const [newTitlePrefix, setNewTitlePrefix] = useState("");
  const [pagesMetaData, setPagesMetaData] = useState({});
  const [newPagesMetaData, setNewPagesMetaData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");


  const fetchMetaData = async () => {
    try {
      const response = await requestByType(types.getPagesMeta);
      if(response.status !== 200 || !response.data){
        Logger.error("Error fetching pages meta data", TITLE_TAGS.UI_COMPONENT);
        return
      }
      setPagesMetaData(response.data.pages);
      setNewPagesMetaData(structuredClone(response.data.pages));
      setTitlePrefix(response.data.titlePrefix);
      setNewTitlePrefix(response.data.titlePrefix);

      console.log(`Pages meta data fetched: ${response.data.pages}`);
    } catch (err) {
      Logger.error(`Pages meta data fetch error: ${err}`, TITLE_TAGS.UI_COMPONENT);
    }
  }

  useEffect(() => {
    fetchMetaData();
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
    setNewPagesMetaData(structuredClone(pagesMetaData));
    // This also does not work
    // setNewPagesMetaData(pagesMetaData);
    setNewTitlePrefix(titlePrefix);
  };

  const isValidMetaData = () => {
    let flag = true;
    if(newTitlePrefix === "" || newPagesMetaData === null || Object.keys(newPagesMetaData).length === 0){
      flag = false;
    }

    Object.entries(newPagesMetaData).forEach(([pageKey, metaValue]) => {
      if(pageKey === "" || metaValue.title === "" || metaValue.description === ""){
        flag = false;
      }
    });

    return flag;
  }
  
  const save = async () => {

    if(!isValidMetaData()){
      setAlertHeading("Hata");
      setAlertMessage("META Bilgileri boş olamaz.");
      setAlertVariant("danger");
      setShowAlert(true);
      navigator.vibrate(200);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return;
    }

    const data = {
      titlePrefix: newTitlePrefix,
      pages: newPagesMetaData,
    }
    const response = await requestByType(types.updatePagesMeta, data);

    if(response?.status === 200){
      setAlertHeading("Başarılı");
      setAlertMessage("META Bilgileri başarıyla güncellendi.");
      setAlertVariant("success");
      setShowAlert(true);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      setPagesMetaData(structuredClone(newPagesMetaData));
      setTitlePrefix(newTitlePrefix);
    }
    else{
      setAlertHeading("Başarısız");
      setAlertMessage("META Bilgileri güncellenirken bir hata oluştu.");
      setAlertVariant("danger");
      window.scrollTo(0, 0);
      navigator.vibrate(200);
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
                  META Bilgi Tanımları
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

          <div className="d-flex justify-start items-center w-auto mx-[0rem] md:mx-[3rem] mt-[3rem] md:mt-[2rem] border-b border-gray-100">
            <Form className="w-full">
              <Form.Group className="mb-3 w-full">
                <Form.Label>Tüm Sayfalar İçin Başlık Ön Eki</Form.Label>
                <Form.Control 
                  type="text" 
                  id="form-title"
                  value={newTitlePrefix}
                  className="w-[50%]"
                  onChange={(e) => setNewTitlePrefix(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>

          <div className="d-flex flex-col items-start justify-start w-auto px-[0.1rem] md:!px-[3rem] pt-3 md:mt-0">
            {newPagesMetaData !== null && Object.keys(newPagesMetaData).length > 0 ? 
              Object.entries(newPagesMetaData).map(([pageKey, metaValue], index) => (
                <div className="d-flex flex-col justify-start items-start w-[100%] my-[1.5rem] md:!my-[0.75rem] pr-0">
                  <h2 className="text-start !text-md mt-0 p-0 !pb-2">
                    {`${metaValue.pageNameTR} ${metaValue.pageNameTR !== "Anasayfa" ? "Sayfası" : ""}`}
                  </h2>
                  <Form key={index} className="w-full">
                    <FormGroup>
                      <Form.Label>Başlık</Form.Label>
                      <Form.Control
                        type="text"
                        value={metaValue.title}
                        onChange={(e) => {
                          const newMetaData = {...newPagesMetaData};
                          newMetaData[pageKey].title = e.target.value;
                          setNewPagesMetaData(newMetaData);
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="mt-3">
                      <Form.Label>Açıklama</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={metaValue.description}
                        onChange={(e) => {
                          const newMetaData = {...newPagesMetaData};
                          newMetaData[pageKey].description = e.target.value;
                          setNewPagesMetaData(newMetaData);
                        }}
                      />
                    </FormGroup>
                    <hr />
                  </Form>
                </div>
                
              ))
              : ""
            }
          </div>

          <Footer />
        </div>
      </React.Fragment>
    );
}
