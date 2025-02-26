import React, { useState, useEffect } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
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

  // Modal durumları
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Seçili ürün
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sıralama ayarları
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sayfalama ayarları
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  // Sütun bazlı arama state'leri
  const [searchName, setSearchName] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchSKU, setSearchSKU] = useState("");
  const [searchStock, setSearchStock] = useState("");
  const [searchSeason, setSearchSeason] = useState("");
  const [searchCategory, setSearchCategory] = useState("");


  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Ürünler çekilemedi.");
        }
        const data = await response.json();
        const mappedProducts = data.map((product) => ({
          id: product.sku,
          name: product.baslik,
          aciklama: product.aciklama,
          brand: product.marka,
          sku: product.sku,
          stock: product.stok,
          season: product.sezon,
          category: product.kategori,
          anaKategori: product.anaKategori,
          alisFiyati: product.alisFiyati,
          satisFiyati: product.satisFiyati,
          paraBirimi: product.paraBirimi,
          barkod: product.barkod,
          vergi: product.vergi,
          birim: product.birim,
          birimAdet: product.birimAdet,
          grup: product.grup,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          selected: false,
          status: true,
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Ürünleri çekme hatası:", error);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Ürün ekleme (geçici)
  const addProduct = () => {
    const newProduct = {
      id: `NEW-${Date.now()}`,
      name: `Yeni Ürün ${products.length + 1}`,
      aciklama: "Detay girilmedi",
      brand: "Bilinmeyen",
      sku: `SKU${Math.floor(100000 + Math.random() * 900000)}`,
      stock: 100,
      season: "Belirtilmemiş",
      category: "Genel",
      anaKategori: "Genel",
      alisFiyati: "0",
      satisFiyati: "0",
      paraBirimi: "TL",
      barkod: "",
      vergi: "0",
      birim: "Adet",
      birimAdet: "1",
      grup: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selected: false,
      status: true,
    };
    setProducts([...products, newProduct]);
  };

  // Seçili ürünleri silme
  const deleteSelectedProducts = () => {
    setProducts(products.filter((p) => !p.selected));
  };

  // Tek ürün silme
  const deleteProduct = (id, e) => {
    e.stopPropagation();
    setProducts(products.filter((p) => p.id !== id));
  };

  // Ürün seçme
  const toggleSelectProduct = (id, e) => {
    e.stopPropagation();
    setProducts(
      products.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  // Tümünü seçme
  const toggleSelectAll = (e) => {
    e.stopPropagation();
    const allSelected = products.every((p) => p.selected);
    setProducts(products.map((p) => ({ ...p, selected: !allSelected })));
  };

  // Sıralama
  const sortColumn = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sıralama ikonu
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

  // Detay modalı
  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };
  const closeDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
  };

  // Düzenleme modalı
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
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };
  const saveProductChanges = () => {
    setProducts(
      products.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))
    );
    closeEditModal();
  };

  // Çoklu sütun arama + sıralama -> filteredProducts
  const multiFilteredProducts = React.useMemo(() => {
    // Önce çoklu sütun arama yapalım
    let temp = products.filter((p) => {
      // "görsel" hariç diğer sütunlarda arıyoruz
      if (
        searchName &&
        !p.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }
      if (
        searchBrand &&
        !p.brand.toLowerCase().includes(searchBrand.toLowerCase())
      ) {
        return false;
      }
      if (searchSKU && !p.sku.toLowerCase().includes(searchSKU.toLowerCase())) {
        return false;
      }
      if (
        searchStock &&
        !String(p.stock).toLowerCase().includes(searchStock.toLowerCase())
      ) {
        return false;
      }
      if (
        searchSeason &&
        !p.season.toLowerCase().includes(searchSeason.toLowerCase())
      ) {
        return false;
      }
      if (
        searchCategory &&
        !p.category.toLowerCase().includes(searchCategory.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    // Sonra sıralama (sortConfig)
    if (sortConfig.key) {
      const { key, direction } = sortConfig;
      temp.sort((a, b) => {
        const valA = key === "stock" ? Number(a[key]) : a[key];
        const valB = key === "stock" ? Number(b[key]) : b[key];
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return temp;
  }, [
    products,
    sortConfig,
    searchName,
    searchBrand,
    searchSKU,
    searchStock,
    searchSeason,
    searchCategory,
  ]);

  // Sayfalama (pagination)
  const totalPages = Math.ceil(multiFilteredProducts.length / itemsPerPage);
  const currentProducts = multiFilteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sayfa değişimi
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination butonları
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
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="mb-4">
          <ol className="breadcrumb fs-sm mb-1 p-2">
            <li className="breadcrumb-item">
              <Link to="#">Ürün ve Kategori</Link>
            </li>
            <li className="breadcrumb-item active text-white" aria-current="page">
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
                disabled={!products.some((p) => p.selected)}
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
                <Table
                  bordered
                  hover
                  responsive
                  className="align-middle text-center table-dark"
                >
                  <thead>
                    {/* 1. Satır (Ana Başlıklar) */}
                    <tr>
                      <th>
                        <Form.Check
                          type="checkbox"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectAll(e);
                          }}
                          checked={products.every((p) => p.selected)}
                        />
                      </th>
                      <th>Görsel</th>
                      <th onClick={() => sortColumn("name")}>
                        Ürün Adı {getSortIcon("name")}
                      </th>
                      <th onClick={() => sortColumn("brand")}>
                        Marka {getSortIcon("brand")}
                      </th>
                      <th onClick={() => sortColumn("sku")}>
                        SKU {getSortIcon("sku")}
                      </th>
                      <th onClick={() => sortColumn("stock")}>
                        <span className="d-inline-flex align-items-center">
                          Stok {getSortIcon("stock")}
                        </span>
                      </th>
                      <th onClick={() => sortColumn("season")}>
                        Sezon {getSortIcon("season")}
                      </th>
                      <th onClick={() => sortColumn("category")}>
                        Kategori {getSortIcon("category")}
                      </th>
                      <th>Eylemler</th>
                    </tr>
                    {/* 2. Satır (Arama Inputları) */}
                    <tr>
                      <th></th>
                      <th></th> {/* Görsel sütunu için boş */}
                      <th>
                        <Form.Control
                          type="text"                        
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          size="sm"
                        />
                      </th>
                      <th>
                        <Form.Control
                          type="text"                  
                          value={searchBrand}
                          onChange={(e) => setSearchBrand(e.target.value)}
                          size="sm"
                        />
                      </th>
                      <th>
                        <Form.Control
                          type="text"                   
                          value={searchSKU}
                          onChange={(e) => setSearchSKU(e.target.value)}
                          size="sm"
                        />
                      </th>
                      <th>
                        <Form.Control
                          type="text"                
                          value={searchStock}
                          onChange={(e) => setSearchStock(e.target.value)}
                          size="sm"
                        />
                      </th>
                      <th>
                        <Form.Control
                          type="text"        
                          value={searchSeason}
                          onChange={(e) => setSearchSeason(e.target.value)}
                          size="sm"
                        />
                      </th>
                      <th>
                        <Form.Control
                          type="text"
                          value={searchCategory}
                          onChange={(e) => setSearchCategory(e.target.value)}
                          size="sm"
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
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <Form.Check
                            type="checkbox"
                            checked={product.selected || false}
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
                            <i className="ri-image-line text-secondary fs-3"></i>
                          </div>
                        </td>
                        <td>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.sku}</td>
                        <td className="text-success fw-bold">{product.stock}</td>
                        <td>{product.season}</td>
                        <td>
                          <Badge bg="primary">{product.category}</Badge>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={(e) => openEditModal(product, e)}
                            className="p-0"
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
                    Toplam {multiFilteredProducts.length} ürün, Sayfa {currentPage} /{" "}
                    {totalPages}
                  </div>
                  <Pagination className="mb-0">{renderPaginationItems()}</Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Ürün Düzenleme Modalı */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ürünü Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <Form>
              <Form.Group controlId="editProductName" className="mb-3">
                <Form.Label>Ürün Adı (MALINCINSI)</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductBrand" className="mb-3">
                <Form.Label>Marka (KOD1)</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={selectedProduct.brand}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductSKU" className="mb-3">
                <Form.Label>SKU (STOKKODU)</Form.Label>
                <Form.Control
                  type="text"
                  name="sku"
                  value={selectedProduct.sku}
                  onChange={handleEditChange}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="editProductStock" className="mb-3">
                <Form.Label>Stok (MERKEZENVANTER)</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={selectedProduct.stock}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductSeason" className="mb-3">
                <Form.Label>Sezon (KOD7)</Form.Label>
                <Form.Control
                  type="text"
                  name="season"
                  value={selectedProduct.season}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="editProductCategory" className="mb-3">
                <Form.Label>Kategori (KOD6)</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={selectedProduct.category}
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
          <Button variant="primary" onClick={saveProductChanges}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Ürün Detay Modalı */}
      <Modal show={showDetailModal} onHide={closeDetailModal}>
        <Modal.Header className="bg-primary" closeButton>
          <Modal.Title>Ürün Detayları</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <p>
                <strong>Ürün Adı:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Marka:</strong> {selectedProduct.brand}
              </p>
              <p>
                <strong>SKU:</strong> {selectedProduct.sku}
              </p>
              <p>
                <strong>Stok:</strong> {selectedProduct.stock}
              </p>
              <p>
                <strong>Sezon:</strong> {selectedProduct.season}
              </p>
              <p>
                <strong>Kategori:</strong> {selectedProduct.category}
              </p>
              <p>
                <strong>Açıklama:</strong> {selectedProduct.aciklama}
              </p>
              <p>
                <strong>Ana Kategori:</strong> {selectedProduct.anaKategori}
              </p>
              <p>
                <strong>Alış Fiyatı:</strong> {selectedProduct.alisFiyati}
              </p>
              <p>
                <strong>Satış Fiyatı:</strong> {selectedProduct.satisFiyati}
              </p>
              <p>
                <strong>Para Birimi:</strong> {selectedProduct.paraBirimi}
              </p>
              <p>
                <strong>Barkod:</strong> {selectedProduct.barkod}
              </p>
              <p>
                <strong>Vergi:</strong> {selectedProduct.vergi}
              </p>
              <p>
                <strong>Birim:</strong> {selectedProduct.birim}
              </p>
              <p>
                <strong>Birim Adet:</strong> {selectedProduct.birimAdet}
              </p>
              <p>
                <strong>Grup:</strong> {selectedProduct.grup}
              </p>
           
            </div>
          )}
        </Modal.Body>

      </Modal>
      <Footer />
    </React.Fragment>
  );
}
