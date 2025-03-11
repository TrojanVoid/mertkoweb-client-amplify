import React, { useState, useEffect } from "react";
import { requestByType, types } from "../../apis/ProductApi";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";


export default function ProductCategory() {
  const currentSkin = localStorage.getItem("skin-mode") ? "dark" : "";
  const [skin, setSkin] = useState(currentSkin);

  const [categories, setCategories] = useState([]);
  const [editedCategories, setEditedCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertHeading, setAlertHeading] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await requestByType(types.getProductCategories);
      setCategories(response.data);
      setEditedCategories(response.data.map(cat => ({ ...cat, isEditing: false })));
    } catch (error) {
      console.error("Kategoriler alınırken hata oluştu:", error);
    }
    setLoading(false);
  };

  const handleEdit = (id) => {
    setEditedCategories(editedCategories.map((cat, index) =>
      index === id ? { ...cat, isEditing: !cat.isEditing } : cat
    ));
  };

  const handleChange = (id, value) => {
    setEditedCategories(editedCategories.map((cat, index) =>
      index === id ? { ...cat, categoryDescription: value } : cat
    ));
  };

  const handleSave = async () => {

    for (const cat of editedCategories) {
      if (cat.categoryDescription.length < 1) {
        setAlertVariant("danger");
        setAlertHeading("Hata!");
        setAlertMessage("Kategori açıklamaları boş olamaz.");
        window.scrollTo(0, 0);
        navigator.vibrate(200); 
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return;
      }
    }

    setLoading(true);
    try {
      const updatedCategories = editedCategories.map(({ isEditing, ...cat }) => cat);
      await requestByType(types.updateProductCategories, updatedCategories);
      setCategories([...updatedCategories]);
      setAlertHeading("Başarılı");
      setAlertMessage("Kategori açıklamaları başarıyla güncellendi.");
      setAlertVariant("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Güncellenirken hata oluştu:", error);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditedCategories([...categories]);
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
                Ürün Kategorileri
              </li>
            </ol>
          </div>
        </div>
  
        <div className="d-flex justify-around md:justify-end items-center w-auto mx-[0rem] md:mx-[3rem] my-2 py-2 bg-gray-300 rounded-lg px-3">
          <Button 
            variant="outline-primary" 
            className="btn-white me-[1%] sm:!me-[2rem] w-[40%] sm:w-[30%] md:w-[15%] text-black"
            onClick={handleCancel}
            disabled={loading}
          >
            Vazgeç
          </Button>
  
          <Button 
            variant="primary" 
            className="w-[40%] sm:w-[30%] md:w-[15%]"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
  
        <div className="d-flex justify-start items-center w-auto mx-[0rem] md:mx-[3rem] mt-[3rem] md:mt-[2rem] border-b border-gray-100">
          {loading ? <Spinner animation="border" /> : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kategori Adı</th>
                  <th>Açıklama</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {editedCategories.map((cat, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{cat.categoryName}</td>
                    <td>
                      {cat.isEditing ? (
                        <Form.Control
                          as="textarea"
                          value={cat.categoryDescription}
                          onChange={(e) => handleChange(index, e.target.value)}
                        />
                      ) : (
                        cat.categoryDescription
                      )}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleEdit(index)}>
                        {cat.isEditing ? "Tamam" : "Düzenle"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
  
        <Footer />
      </div>
    </React.Fragment>
  );
  
};
