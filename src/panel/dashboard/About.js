import React, { useEffect, useState } from "react";
import { Alert, Button, Form, FormGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const { requestByType, types } = require("../../apis/AboutApi");
const maxAboutImages = 3;

export default function About() {
  ///// Skin Switch /////
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const [aboutData, setAboutData] = useState([]);
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [title, setTitle] = useState("");

  const [aboutImages, setAboutImages] = useState([]);
  const [newAboutImages, setNewAboutImages] = useState(Array(maxAboutImages).fill(null));

  useEffect(() => {
    fetchAboutData();
    fetchAboutImages();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await requestByType(types.getAbout);
      setAboutData(response.data);
      if (response.data && response.data.content1 && response.data.content2) {
        setContent1(response.data.content1);
        setContent2(response.data.content2);
      }
      if (response.data.title) {
        setTitle(response.data.title);
      }
    } catch (err) {
      console.error("About data fetch error:", err);
    }
  };

  const fetchAboutImages = async () => {
    try {
      const response = await requestByType(types.getAboutImages);
      if (response && response.data && response.data.length > 0) {
        setAboutImages(response.data);
        const images = [...response.data];
        while (images.length < maxAboutImages) {
          images.push(null);
        }
        setNewAboutImages(images);
      } else {
        setAboutImages([]);
        setNewAboutImages(Array(maxAboutImages).fill(null));
      }
    } catch (err) {
      console.error("About images fetch error:", err);
    }
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
    setContent1(aboutData.content1);
    setContent2(aboutData.content2);
    setTitle(aboutData.title);
    document.getElementById("form-content1").value = aboutData.content1;
    document.getElementById("form-content2").value = aboutData.content2;
    document.getElementById("form-title").value = aboutData.title;

    const images = structuredClone(aboutImages) || [];
    while (images.length < maxAboutImages) {
      images.push(null);
    }
    setNewAboutImages(images);
  };

  const save = async () => {
    const data = {
      title: title,
      content1: content1,
      content2: content2,
    };
    const response = await requestByType(types.updateAbout, data);
  
    // Delete all images on the server first
    await requestByType(types.deleteAllAboutImages);
  
    let allImagesUploadedSuccessfully = true;
    for (let index = 0; index < newAboutImages.length; index++) {
      const image = newAboutImages[index];
      if (!image) {
        continue;
      }
      let fileToUpload;
      if (image.id) {
        // For server images, fetch the file as a blob and create a File object
        try {
          const fetchResponse = await fetch(image.url);
          const blob = await fetchResponse.blob();
          // Use a default filename or
          fileToUpload = new File([blob], "aboutImage.jpg", { type: blob.type });
        } catch (err) {
          console.error("Error fetching image from URL:", err);
          allImagesUploadedSuccessfully = false;
          continue;
        }
      } else {
        // Client-side image is already a file object
        fileToUpload = image;
      }
      const formData = new FormData();
      formData.append("image", fileToUpload);
      const imageResponse = await requestByType(types.uploadAboutImage, formData);
      if (imageResponse?.status !== 200) {
        allImagesUploadedSuccessfully = false;
      } else {
        // Update with the server response image data
        replaceImageAtIndex(imageResponse.data, index);
      }
    }
  
    if (response?.status === 200 && allImagesUploadedSuccessfully) {
      setAlertHeading("Başarılı");
      setAlertMessage("Hakkımızda içeriği başarıyla güncellendi.");
      setAlertVariant("success");
      setShowAlert(true);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setAlertHeading("Başarısız");
      if (allImagesUploadedSuccessfully) {
        setAlertMessage("Hakkımızda içeriği güncellenirken bir hata oluştu.");
      } else {
        setAlertMessage("Hakkımızda resimleri yüklenirken bir hata oluştu.");
      }
      setAlertVariant("danger");
      window.scrollTo(0, 0);
      navigator.vibrate(200);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };
  

  const replaceImageAtIndex = (image, index) => {
    setNewAboutImages((prev) => {
      const updatedImages = prev && Array.isArray(prev) ? [...prev] : [];
      // Ensure the array has a length of at least maxAboutImages
      for (let i = updatedImages.length; i < maxAboutImages; i++) {
        updatedImages[i] = null;
      }
      updatedImages[index] = image;
      console.log(`Updated images: ${updatedImages}`);
      return updatedImages;
    });
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
                Hakkımızda Tanımları
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

          <Button variant="primary" className="w-[40%] sm:w-[30%] md:w-[15%]" onClick={save}>
            Kaydet
          </Button>
        </div>

        <div className="d-flex flex-col justify-start items-start bg-white border border-gray-100 rounded-xl p-5 mt-5 mx-[0rem] md:mx-[3rem] mt-[3rem] md:mt-[2rem] shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
          <h2 className="heading3 !text-2xl !font-bold text-start w-full border-b border-black pb-2">Yazı İçeriği</h2>
          <div className="d-flex justify-start items-center w-full pt-2 pb-2">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="font-semibold !text-lg">Başlık</Form.Label>
                <Form.Control
                  type="text"
                  id="form-title"
                  defaultValue={aboutData.title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
            </Form>
          </div>

          <div className="d-flex flex-col w-full my-2">
            <h2 className="heading3 !text-lg !font-semibold text-start w-full border-b border-black pt-2 pb-2">Paragraflar</h2>
            <div className="d-flex flex-col md:flex-row items-start justify-around w-full px-[0.1rem] md:!px-[3rem] pt-3 md:mt-3">
              <div className="d-flex flex-col w-[100%] md:!w-[50%] pr-0 md:pr-5">
                <Form className="d-flex flex-col w-full">
                  <FormGroup className="mb-3">
                    <Form.Label className="font-medium">Birinci Paragraf</Form.Label>
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

              <div className="d-flex flex-col w-[100%] md:!w-[50%] mt-[1rem] md:!mt-[0rem]">
                <Form className="d-flex flex-col w-full">
                  <FormGroup className="mb-3">
                    <Form.Label className="font-medium">İkinci Paragraf</Form.Label>
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
          </div>
        </div>

        <div className="d-flex flex-col justify-center items-start w-auto mx-[0rem] md:mx-[3rem] mt-[3rem] md:mt-[2rem] border bg-white border-gray-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
          <h2 className="heading3 !font-bold !text-2xl text-start w-full border-b border-black pb-2">Görseller</h2>
          <div className="d-flex flex-col w-full">
            {newAboutImages.map((image, index) => {
              const promptText = image && image.id
                ? "Mevcut Resmi Değiştir"
                : "Yeni Resim Yükle";
              
              return (
                <div className="mt-[3rem]">
                  <h2 className="heading3 !font-semibold !text-xl"> {`${index + 1}. Resim İçeriği`} </h2>
                  <div key={index} className="d-flex flex-col w-full mt-3">
                    {/* Render image preview if an image is available */}
                    {image && !image.id && (
                      <div className="relative w-full">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name || `Görsel ${index + 1}`}
                          className="w-full"
                        />
                        <Button
                          variant="danger"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => replaceImageAtIndex(null, index)}
                        >
                          <Icon.Trash size={20} />
                        </Button>
                      </div>
                    )}
                    {image && image.id && (
                      <div className="relative w-full">
                        <img
                          src={image.url}
                          alt={image.altDescription || `Görsel ${index + 1}`}
                          className="w-full"
                        />
                        <Button
                          variant="danger"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => replaceImageAtIndex(null, index)}
                        >
                          <Icon.Trash size={20} />
                        </Button>
                      </div>
                    )}

                    {/* Custom file input */}
                    <div className="relative mt-4 w-full">
                      {/* Hide the actual file input */}
                      <input
                        id={`customFile-${index}`}
                        type="file"
                        className="hidden w-full"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          replaceImageAtIndex(file, index);
                        }}
                      />
                      <label
                        htmlFor={`customFile-${index}`}
                        className="cursor-pointer w-full inline-block px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        {promptText}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </React.Fragment>
  );
}
