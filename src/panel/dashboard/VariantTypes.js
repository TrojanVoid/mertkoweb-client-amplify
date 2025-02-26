import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Button, Card, Table, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function RenkVaryantlari() {
  // Varyant tipleri state
  const [variantTypes, setVariantTypes] = useState([]);
  // Arama alanı için state
  const [searchTerm, setSearchTerm] = useState("");
  // Yeni varyant tipi için state
  const [newVariant, setNewVariant] = useState("");
  // Düzenleme modalı state
  const [showEditModal, setShowEditModal] = useState(false);
  // Yeni varyant ekleme modalı state
  const [showAddModal, setShowAddModal] = useState(false);
  // Düzenlenecek varyant state
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Örnek başlangıç verileri (API'den de çekilebilir)
  useEffect(() => {
    // Başlangıç için örnek varyant tipleri
    setVariantTypes([
      { id: 1, name: "Renk" },
      { id: 2, name: "Cinsiyet" },
    ]);
  }, []);

  // Arama filtrelemesi
  const filteredVariants = variantTypes.filter((variant) =>
    variant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Yeni varyant ekleme fonksiyonu
  const handleAddVariant = () => {
    if (newVariant.trim() === "") return;
    const variant = {
      id: Date.now(), // benzersiz id
      name: newVariant.trim(),
    };
    setVariantTypes([...variantTypes, variant]);
    setNewVariant("");
    setShowAddModal(false);
  };

  // Varyantı silme fonksiyonu
  const handleDeleteVariant = (id) => {
    setVariantTypes(variantTypes.filter((variant) => variant.id !== id));
  };

  // Varyant düzenleme: Modal açma
  const openEditModal = (variant, e) => {
    e.stopPropagation();
    setSelectedVariant(variant);
    setShowEditModal(true);
  };

  // Düzenleme modalını kapatma
  const closeEditModal = () => {
    setSelectedVariant(null);
    setShowEditModal(false);
  };

  // Düzenleme formundaki değişikliği işleme
  const handleEditChange = (e) => {
    setSelectedVariant({ ...selectedVariant, name: e.target.value });
  };

  // Düzenlemeyi kaydetme
  const saveVariantChanges = () => {
    setVariantTypes(
      variantTypes.map((variant) =>
        variant.id === selectedVariant.id ? selectedVariant : variant
      )
    );
    closeEditModal();
  };

  return (
    <React.Fragment>
      <Header />
      
      <div className="main main-app p-3 p-lg-4">

         <div className="mb-4">
                  <ol className="breadcrumb fs-sm mb-1 p-2">
                    <li className="breadcrumb-item">
                      <Link to="#">Ürün ve Kategori</Link>
                    </li>
                    <li className="breadcrumb-item active text-white" aria-current="page">
                      Varyant Tipleri
                    </li>
                  </ol>
                </div>
        {/* Arama alanı ve "Varyant Tipi Ekle" butonu */}
        <Card className="mb-4 shadow-sm">
          <Card.Body className="d-flex justify-content-between align-items-center">
            
            {/* Arama kutusu */}
            <div
              className="form-search me-auto"
              style={{
                position: "relative",
                maxWidth: "300px",
                backgroundColor: "#1a1f2b", // Arka plan koyu
                borderRadius: "0.375rem",
              }}
            >
              <input
                type="text"
                placeholder="Ara..."
                className="form-control"
                style={{
                  backgroundColor: "transparent", // Input arka planı şeffaf
                  border: "none",                 // Kenarlık yok
                  color: "#ffffff",               // Metin rengi
                  padding: "0.5rem 2rem 0.5rem 0.75rem", 
                  outline: "none",                // Odak kenarlığı yok
                  boxShadow: "none",             // Varsayılan gölgeyi kaldır
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i
                className="ri-search-line"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                  pointerEvents: "none",
                }}
              ></i>
            </div>
            
            <Button variant="success" onClick={() => setShowAddModal(true)}>
            Varyant Tipi Ekle
            </Button>
          </Card.Body>
        </Card>

        {/* Varyant Tipleri Listesi */}
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Varyant Tipleri</h5>
          </Card.Header>
          <Card.Body>
            <Table bordered hover responsive className="table-dark">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">Varyant Tipi</th>
                  <th className="text-center">Eylemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center">
                      Hiç varyant tipi bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="text-center">{variant.name}</td>
                      <td className="text-center">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={(e) => openEditModal(variant, e)}
                          title="Düzenle"
                        >
                          <i className="ri-edit-line fs-4"></i>
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleDeleteVariant(variant.id)}
                          title="Sil"
                        >
                          <i className="ri-delete-bin-line fs-4"></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Varyant Düzenleme Modalı */}
      <Modal show={showEditModal} onHide={closeEditModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Varyant Tipini Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVariant && (
            <Form>
              <Form.Group controlId="editVariantName">
                <Form.Label>Varyant Tipi</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedVariant.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            İptal
          </Button>
          <Button variant="primary" onClick={saveVariantChanges}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Yeni Varyant Ekleme Modalı */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Yeni Varyant Tipi Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="addVariantName">
              <Form.Label>Varyant Tipi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Örneğin: Renk, Cinsiyet..."
                value={newVariant}
                onChange={(e) => setNewVariant(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleAddVariant}>
            Ekle
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </React.Fragment>
  );
}
