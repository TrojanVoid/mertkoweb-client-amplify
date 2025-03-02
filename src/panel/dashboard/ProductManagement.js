import React, { useState, useEffect, useMemo } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Carousel } from "react-bootstrap";
import {
  Button,
  Card,
  Form,
  Table,
  Spinner,
  Badge,
  Modal,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFileChange(e); 
  }
};

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  
  const [selectedProduct, setSelectedProduct] = useState(null);

  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchVolume, setSearchVolume] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        
        const response = await fetch("http://localhost:5001/api/all-products");
        if (!response.ok) {
          throw new Error("Ürünler çekilemedi.");
        }
        const data = await response.json();
       
        const mappedProducts = data.map((product) => ({
          ...product,
          isSelected: product.isSelected || false,
          
        }));
        
        for(let i=0; i<mappedProducts.length; i++){
          if(mappedProducts[i].category==="p"){
            mappedProducts[i].category="Plastik Şişe";
          }
          else if(mappedProducts[i].category=="k"){
            mappedProducts[i].category="Plastik Kavanoz"
          }
          else if(mappedProducts[i].category==="c"){
            mappedProducts[i].category="Konsept Ürün";
          }
         
          
        }
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Ürünleri çekme hatası:", error);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  
  const addProduct = () => {
    const newProduct = {
      id: `NEW-${Date.now()}`,
      name: `Yeni Ürün ${products.length + 1}`,
      volume: 0,
      category: "Genel",
      description: "Detay girilmedi",
      isBestSeller: false,
      isNewRelease: false,
      isSelected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [],
    };
    setProducts([...products, newProduct]);
  };


  const deleteSelectedProducts = () => {
    setProducts(products.filter((p) => !p.isSelected));
  };


  const deleteProduct = (id, e) => {
    e.stopPropagation();
    setProducts(products.filter((p) => p.id !== id));
  };

   // Çoklu dosya seçimi için:
const handleMultipleFileChange = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    const newImages = files.map((file) => ({
      image: file,
      imageUrl: URL.createObjectURL(file),
    }));
    setSelectedProduct({
      ...selectedProduct,
      images: [...(selectedProduct.images || []), ...newImages],
    });
  }
};

// Drag & Drop olayları (daha önce tanımladığınız handleDragOver/Leave ile uyumlu)
const handleImageDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  const files = Array.from(e.dataTransfer.files);
  if (files.length > 0) {
    const newImages = files.map((file) => ({
      image: file,
      imageUrl: URL.createObjectURL(file),
    }));
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      images: [...(prevProduct.images || []), ...newImages],
    }));
  }
};


// Görsel silme
const removeImage = (index) => {
  const updatedImages = selectedProduct.images.filter((_, i) => i !== index);
  setSelectedProduct({
    ...selectedProduct,
    images: updatedImages,
  });
};

// Görsel sıralamasını değiştirme: Yukarı taşıma
const moveImageUp = (index) => {
  if (index <= 0) return;
  const updatedImages = [...selectedProduct.images];
  [updatedImages[index - 1], updatedImages[index]] = [updatedImages[index], updatedImages[index - 1]];
  setSelectedProduct({
    ...selectedProduct,
    images: updatedImages,
  });
};

// Görsel sıralamasını değiştirme: Aşağı taşıma
const moveImageDown = (index) => {
  if (index >= selectedProduct.images.length - 1) return;
  const updatedImages = [...selectedProduct.images];
  [updatedImages[index], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[index]];
  setSelectedProduct({
    ...selectedProduct,
    images: updatedImages,
  });
};

 
  const toggleSelectProduct = (id, e) => {
    e.stopPropagation();
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, isSelected: !p.isSelected } : p
      )
    );
  };
  

  const toggleSelectAll = (e) => {
    e.stopPropagation();
    const allSelected = products.every((p) => p.isSelected);
    setProducts(products.map((p) => ({ ...p, isSelected: !allSelected })));
  };

  
  const sortColumn = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };


  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <i className="ri-arrow-up-down-line ms-1 text-muted"></i>;
    }
    return sortConfig.direction === "asc" ? (
      <i className="ri-arrow-up-s-line ms-1"></i>
    ) : (
      <i className="ri-arrow-down-s-line ms-1"></i>
    );
  };


  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProduct({
        ...selectedProduct,
        image: file, // Dosya nesnesi, sunucuya FormData ile gönderilebilir
        imageUrl: URL.createObjectURL(file) // Önizleme için geçici URL
      });
    }
  };
  


  const openEditModal = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setSelectedProduct(null);
    setShowEditModal(false);
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const saveProductChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/update-product/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct)
      });
      if (!response.ok) {
        console.log("ürün güncelleme başarısız");
        throw new Error("Ürün güncelleme başarısız");
      }
      const updatedProduct = await response.json();
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      console.log("Ürün güncellendi:", updatedProduct);
      closeEditModal();
    } catch (error) {
      console.error("Ürün güncellenirken hata:", error);
    }
  };


  const multiFilteredProducts = useMemo(() => {
    let temp = products.filter((p) => {
      if (
        searchName &&
        !p.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }
      if (
        searchCategory &&
        !p.category.toLowerCase().includes(searchCategory.toLowerCase())
      ) {
        return false;
      }
      if (searchVolume && !String(p.volume).includes(searchVolume)) {
        return false;
      }
      return true;
    });

    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      temp.sort((a, b) => {
        const valA = key === "volume" ? Number(a[key]) : a[key];
        const valB = key === "volume" ? Number(b[key]) : b[key];
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return temp;
  }, [products, sortConfig, searchName, searchCategory, searchVolume]);


  const totalPages = Math.ceil(multiFilteredProducts.length / itemsPerPage);
  const currentProducts = multiFilteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    let items = [];
    items.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    );
    return items;
  };

  return (
    <>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="mb-4">
          <ol className="breadcrumb fs-sm mb-1 p-2">
            <li className="breadcrumb-item">
              <Link to="#">Ürün ve Kategori</Link>
            </li>
            <li className="breadcrumb-item active text-black" aria-current="page">
              Ürün Yönetimi
            </li>
          </ol>
        </div>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center bg-primary">
            <h5 className="mb-0 text-white">Ürün Listesi</h5>
            <div className="d-flex gap-2">
              <Button variant="success" onClick={addProduct}>
                <i className="ri-add-line"></i> Ürün Ekle
              </Button>
              <Button
                variant="danger"
                onClick={deleteSelectedProducts}
                disabled={!products.some((p) => p.isSelected)}
              >
                <i className="ri-delete-bin-line"></i> Seçilenleri Sil
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Ürünler yükleniyor...</p>
              </div>
            ) : (
              <>
                <Table bordered hover responsive className="align-middle text-center  ">
  <thead>

    <tr>
      <th></th>
      <th>Görsel</th>
      <th onClick={() => sortColumn("name")}>
        Ürün Adı {getSortIcon("name")}
      </th>
      <th onClick={() => sortColumn("volume")}>
        Hacim {getSortIcon("volume")}
      </th>
      <th onClick={() => sortColumn("category")}>
        Kategori {getSortIcon("category")}
      </th>
      <th>Eylemler</th>
    </tr>


    <tr>

      <th>
        <Form.Check
          type="checkbox"
          onClick={(e) => {
            e.stopPropagation();
            toggleSelectAll(e);
          }}
          checked={products.every((p) => p.isSelected)}
        />
      </th>


      <th>
       
      </th>

      <th>
      <Form.Control
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          size="sm"
          placeholder="Ara..."
        />
      </th>

      <th>
      <Form.Control
          type="text"
          value={searchVolume}
          onChange={(e) => setSearchVolume(e.target.value)}
          size="sm"
          placeholder="Ara..."
        />
      </th>
      <th> 
      <Form.Control
          type="text"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          size="sm"
          placeholder="Ara..."
        />
      </th>
      <th></th>
    </tr>
  </thead>

  <tbody>
  {currentProducts.map((product) => (
    <tr
      key={product.id}
      onClick={() => openDetailModal(product)}
      style={{ cursor: "pointer" }}
      className={product.isSelected ? "table-active" : ""}
    >
      <td onClick={(e) => e.stopPropagation()}>
        <Form.Check
          type="checkbox"
          checked={product.isSelected}
          onChange={(e) => toggleSelectProduct(product.id, e)}
        />
      </td>
      <td onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            width: 60,
            height: 60,
            backgroundColor: "#f0f0f0",
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
          }}
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].imageUrl}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 5,
              }}
            />
          ) : (
            <i className="ri-image-line text-secondary fs-3"></i>
          )}
        </div>
      </td>
      <td>{product.name}</td>
      <td>{product.volume}</td>
      <td>{product.category}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <Button
          variant="link"
          size="sm"
          onClick={(e) => openEditModal(product, e)}
          className="p-0 me-2"
        >
          <i className="ri-edit-line fs-4"></i>
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={(e) => deleteProduct(product.id, e)}
          className="p-0"
        >
          <i className="ri-delete-bin-line fs-4"></i>
        </Button>
      </td>
    </tr>
  ))}
</tbody>

            </Table>
                <div className="d-flex justify-content-between align-items-center mt-3 text-white">
                  <div>
                    Toplam {multiFilteredProducts.length} ürün, Sayfa {currentPage} / {totalPages}
                  </div>
                  <Pagination className="mb-0">{renderPaginationItems()}</Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title className="text-white">Ürünü Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
              <Form.Group controlId="editProductName" className="mb-3">
                <Form.Label>Ürün Adı</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductVolume" className="mb-3">
                <Form.Label>Hacim</Form.Label>
                <Form.Control
                  type="number"
                  name="volume"
                  value={selectedProduct.volume}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductCategory" className="mb-3">
                <Form.Label>Kategori</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={selectedProduct.category}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductDescription" className="mb-3">
                <Form.Label>Açıklama</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={selectedProduct.description || ""}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductBestSeller" className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isBestSeller"
                  label="Best Seller"
                  checked={selectedProduct.isBestSeller}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductNewRelease" className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="isNewRelease"
                  label="New Release"
                  checked={selectedProduct.isNewRelease}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductImages" className="mb-3">
  <Form.Label className="fw-bold">Ürün Görselleri</Form.Label>
  <Form.Text className="text-muted d-block mb-2">
    Görselleri sürükleyip bırakın veya tıklayarak seçin.
  </Form.Text>
  <div className="d-flex flex-wrap gap-2">
    {selectedProduct.images && selectedProduct.images.map((img, index) => (
      <div key={index} style={{ position: 'relative', width: '120px', height: '120px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <img
          src={img.imageUrl}
          alt={`Görsel ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Silme Butonu */}
        <Button
          variant="light"
          size="sm"
          style={{ position: 'absolute', top: '2px', right: '2px' }}
          onClick={() => removeImage(index)}
        >
          <i className="ri-close" style={{ fontSize: '1.8rem', color: '#dc3545', zIndex:10 }}></i>
        </Button>
        {/* Sıralama Butonları */}
        {index > 0 && (
          <Button
            variant="light"
            size="sm"
            style={{ position: 'absolute', bottom: '2px', left: '2px' }}
            onClick={() => moveImageUp(index)}
          >
            <i className="ri-arrow-up-s-line"></i>
          </Button>
        )}
        {index < selectedProduct.images.length - 1 && (
          <Button
            variant="light"
            size="sm"
            style={{ position: 'absolute', bottom: '2px', right: '2px' }}
            onClick={() => moveImageDown(index)}
          >
            <i className="ri-arrow-down-s-line"></i>
          </Button>
        )}
      </div>
    ))}
    {/* Yeni Görsel Eklemek için Drop Zone */}
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleImageDrop}
      onClick={() => document.getElementById("hiddenMultipleFileInput").click()}
      style={{
        border: dragActive ? "3px dashed #28a745" : "3px dashed #ccc",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        width: "120px",
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: dragActive ? "#e9f7ef" : "#f8f9fa",
      }}
    >
      <p style={{ color: "#6c757d", fontSize: "14px", margin: 0 }}>+ Ekle</p>
    </div>
  </div>
  <Form.Control
    id="hiddenMultipleFileInput"
    type="file"
    name="images"
    accept="image/*"
    multiple
    style={{ display: "none" }}
    onChange={handleMultipleFileChange}
  />
</Form.Group>


            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            İptal
          </Button>
          <Button variant="primary" onClick={saveProductChanges}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={closeDetailModal}>
  <Modal.Header className="bg-primary" closeButton>
    <Modal.Title className="text-white">Ürün Detayları</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedProduct && (
      <div style={{ textAlign: "center" }}>
        {selectedProduct.images && selectedProduct.images.length > 0 && (
          selectedProduct.images.length > 1 ? (
            <Carousel indicators={false} controls={true} interval={3000} style={{ marginBottom: "15px" }}>
              {selectedProduct.images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={img.imageUrl}
                    alt={`Slide ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div style={{ marginBottom: "15px" }}>
              <img
                src={selectedProduct.images[0].imageUrl}
                alt={selectedProduct.name}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "5px",
                }}
              />
            </div>
          )
        )}
        <p>
          <strong>Ürün Adı:</strong> {selectedProduct.name}
        </p>
        <p>
          <strong>Hacim:</strong> {selectedProduct.volume}
        </p>
        <p>
          <strong>Kategori:</strong> {selectedProduct.category}
        </p>
        <p>
          <strong>Açıklama:</strong> {selectedProduct.description}
        </p>
        <p>
          <strong>Best Seller:</strong> {selectedProduct.isBestSeller ? "Evet" : "Hayır"}
        </p>
        <p>
          <strong>New Release:</strong> {selectedProduct.isNewRelease ? "Evet" : "Hayır"}
        </p>
      </div>
    )}
  </Modal.Body>
</Modal>

      <Footer />
    </>
  );
} 