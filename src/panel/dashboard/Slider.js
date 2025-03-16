import React, { useEffect, useState } from "react";
import { Alert, Button, Form, FormGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useConfirm } from "../context/ConfirmContext";

const { requestByType, types } = require("../../apis/SliderApi");
const { isValidObjectData } = require("../../util/DataValidator");

const Slider = () => {
  // Skin and data states
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);
  const [sliderData, setSliderData] = useState([]);
  const [newSliderData, setNewSliderData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [collapsedItems, setCollapsedItems] = useState({});

  const fetchSliderData = async () => {
    try {
      const response = await requestByType(types.getSlider);
      const sortedData = sortCarouselEntitiesByDisplayIndex(response.data);
      setSliderData(sortedData);
      setNewSliderData(structuredClone(sortedData));
    } catch (err) {
      console.error("Slider data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSliderData();
  }, []);

  const sortCarouselEntitiesByDisplayIndex = (carouselEntities) => {
    return carouselEntities.sort((a, b) => a.displayIndex - b.displayIndex);
  };

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
    setNewSliderData(structuredClone(sliderData));
  };

  const save = async () => {
    // Validate that no slider has empty title or imageUrl
    for (let i = 0; i < newSliderData.length; i++) {
      const slider = newSliderData[i];
      if (
        !slider.title ||
        slider.title.trim() === "" ||
        (!slider.imageUrl || slider.imageUrl.trim() === "") && (!slider.image)
      ) {
        navigator.vibrate && navigator.vibrate(200);
        window.scrollTo(0, 0);
        setAlertVariant("danger");
        setAlertHeading("Hata");
        setAlertMessage("Boş slider öğesi kayıt edilemez. Lütfen tüm slider öğelerinin başlık ve resim yüklemesini tamamlayın veya silin.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        return;
      }
    }

    try {
      let allRequestsSucceeded = true;
      await Promise.all(
        newSliderData.map(async (slide, index) => {
          if (!slide.id || slide.id < 0) {
            if(slide.id < 0){
              const response = await requestByType(types.deleteSlide, { id: -slide.id });
              if (response.status !== 200) {
                allRequestsSucceeded = false;
              }
            }
            const formData = new FormData();
            formData.append("image", slide.image);
            formData.append("title", slide.title);
            const response = await requestByType(types.uploadSlide, formData);
            allRequestsSucceeded = response.status === 200;
          } 
          else if (
            slide.title !== sliderData[index].title &&
            slide.imageUrl === sliderData[index].imageUrl)  {
              const response = await requestByType(types.updateSlideTitle, { id: slide.id, title: slide.title });
              allRequestsSucceeded = response.status === 200;
          }
          else if(slide.newIndex !== undefined){
            const response = await requestByType(types.repositionSlide, { id: slide.id, newIndex: slide.newIndex });
            allRequestsSucceeded = response.status === 200;
          }
        })
      );

      await sliderData.forEach(async (slide, index) => {
        if (!newSliderData[index]) {
          const response = await requestByType(types.deleteSlide, { id: slide.id });
          if (response.status !== 200) {
            allRequestsSucceeded = false;
          }
        }
      });

      if (allRequestsSucceeded) {
        setAlertVariant("success");
        setAlertHeading("Başarılı");
        setAlertMessage("Slider verileri güncellendi.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        navigator.vibrate && navigator.vibrate(200);
        setAlertVariant("danger");
        setAlertHeading("Hata");
        setAlertMessage("Bazı Slider verileri güncellenemedi. Sayfayı yenileyip tekrar deneyin.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (err) {
      console.error("Slider data update error:", err);
      navigator.vibrate && navigator.vibrate(200);
      setAlertVariant("danger");
      setAlertHeading("Hata");
      setAlertMessage("Slider verileri güncellenemedi.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
    window.scrollTo(0, 0);
  };

  const addNewSlider = () => {
    if (newSliderData.length > 0) {
      const lastSlider = newSliderData[newSliderData.length - 1];
      if (
        !lastSlider.title ||
        !lastSlider.imageUrl ||
        lastSlider.title.trim() === "" ||
        lastSlider.imageUrl.trim() === ""
      ) {
        navigator.vibrate && navigator.vibrate(200);
        window.scrollTo(0, 0);
        setAlertVariant("danger");
        setAlertHeading("Hata");
        setAlertMessage("Yeni slider eklemeden önce lütfen mevcut boş slider ögesini doldurun.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        return;
      }
    }
    setNewSliderData([...newSliderData, { title: "", imageUrl: "" }]);
  };

  // Toggle collapse state for a given slider index
  const toggleCollapse = (index) => {
    setCollapsedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <React.Fragment>
      <Header onSkin={setSkin} />
      <div className="main main-app p-3 p-lg-4">
        <Alert show={showAlert} variant={alertVariant}>
          <Alert.Heading>{alertHeading}</Alert.Heading>
          <p>{alertMessage}</p>
          <hr />
        </Alert>

        <div className="d-md-flex align-items-center justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="/panel">Panel</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Slider Tanımları
              </li>
            </ol>
          </div>
        </div>

        <div className="d-flex justify-around md:justify-end items-center w-auto mx-[0rem] md:mx-[3rem] my-2 py-2 bg-gray-300 rounded-lg px-3">
          <Button variant="outline-primary" className="btn-white me-3 sm:me-4 w-[40%] sm:w-[30%] md:w-[15%]" onClick={resetToConfigValue}>
            Vazgeç
          </Button>
          <Button variant="primary" className="w-[40%] sm:w-[30%] md:w-[15%]" onClick={save}>
            Kaydet
          </Button>
        </div>

        <h1 className="text-start mt-4 pl-0 md:pl-[3rem]">Slider İçerikleri</h1>

        <div className="d-flex flex-col items-start justify-start w-auto px-[0.1rem] md:px-[3rem] pt-3 md:mt-3">
          {newSliderData?.map((slider, index) => (
            <div key={index} className="w-full border border-gray-100 rounded-lg bg-white p-4 mb-4">
              {/* Header with collapse toggle */}
              <div className="w-full d-flex justify-between items-center">
                <div className="w-full d-flex items-center">
                  <Button
                    className="btn-white p-0 me-2 border-0 text-black focus:!bg-white"
                    onClick={() => toggleCollapse(index)}
                  >
                    {!collapsedItems[index] ? <Icon.CaretDown size={16} className="focus:" /> : <Icon.CaretUp size={16} />}
                  </Button>
                  <Form.Label onClick={() => toggleCollapse(index)} className="text-lg m-0 cursor-pointer w-full">{`${index + 1}. Slider İçeriği`}</Form.Label>
                </div>
                {/* Only show reorder and trash buttons when expanded */}
                {collapsedItems[index] && (
                  <div className="d-flex flex-row justify-end items-center me-2 gap-2">
                    {index > 0 && (
                      <Button
                        variant="outline-primary"
                        className="btn-white flex justify-center items-center w-[40%] sm:w-[30%] md:w-[15%] p-0 border-0 me-2 text-black focus:!bg-white hover:!bg-white hover:!text-black"
                        onClick={() => {
                          const temp = [...newSliderData];
                          const swap = temp[index];
                          temp[index].newIndex = index - 1;
                          temp[index - 1].newIndex = index;
                          temp[index] = temp[index - 1];
                          temp[index - 1] = swap;
                          setNewSliderData(temp);
                        }}
                      >
                        <Icon.CaretUp size={16} />
                      </Button>
                    )}
                    {index < newSliderData.length - 1 && (
                      <Button
                        variant="outline-primary"
                        className="btn-white flex justify-center items-center w-[40%] sm:w-[30%] md:w-[15%] p-0 border-0 me-2 text-black focus:!bg-white hover:!bg-white hover:!text-black"
                        onClick={() => {
                          const temp = [...newSliderData];
                          const swap = temp[index];
                          temp[index].newIndex = index + 1;
                          temp[index + 1].newIndex = index;
                          temp[index] = temp[index + 1];
                          temp[index + 1] = swap;
                          setNewSliderData(temp);
                        }}
                      >
                        <Icon.CaretDown size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      className="btn-white w-[40%] sm:w-[30%] md:w-[15%] h-auto p-0 border-0 hover:!text-red focus:!text-red"
                      onClick={() => {
                        const temp = [...newSliderData];
                        temp.splice(index, 1);
                        setNewSliderData(temp);
                      }}
                    >
                      <Icon.Trash size={16} />
                    </Button>
                  </div>
                )}
              </div>
              {/* Collapsible content */}
              {collapsedItems[index] && (
                <Form className="w-full mt-3">
                  <Form.Group className="mb-3 w-full">
                    <Form.Control
                      type="text"
                      id={`slider-title-${index}`}
                      value={slider.title}
                      placeholder="Slider başlığı"
                      onChange={(e) => {
                        const temp = [...newSliderData];
                        temp[index].title = e.target.value;
                        setNewSliderData(temp);
                      }}
                    />
                    <div className="mt-2">
                      {slider.imageUrl ? (
                        <div className="flex flex-col items-start">
                          <img src={slider.imageUrl} alt={`Slider ${index + 1}`} className="w-full h-auto mb-2 rounded" />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              const temp = [...newSliderData];
                              temp[index].imageUrl = "";
                              temp[index].id = -temp[index].id;
                              setNewSliderData(temp);
                            }}
                          >
                            Resmi Değiştir
                          </Button>
                        </div>
                      ) : (
                        <Form.Group>
                          <Form.Label>Resim Yükle</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const temp = [...newSliderData];
                              temp[index].image = e.target.files[0];
                              setNewSliderData(temp);
                            }}
                          />
                        </Form.Group>
                      )}
                    </div>
                  </Form.Group>
                </Form>
              )}
            </div>
          ))}

          <div className="d-flex flex-row w-full justify-center md:justify-end items-center mt-3 px-[0rem] md:px[1rem]">
            <Button variant="primary" className="w-full sm:w-[35%] md:w-[25%]" onClick={addNewSlider}>
              <span className="text-md">Yeni Slider Ekle</span>
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Slider;
