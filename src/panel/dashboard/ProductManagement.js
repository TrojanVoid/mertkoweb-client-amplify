import React, { useState, useEffect, useMemo } from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Carousel } from "react-bootstrap";
import DynamicTable from "../components/DynamicTable";
import {
  Button,
  Card,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { requestByType, types } from "../../apis/ProductApi";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);


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

  function getCategoryDisplayName(categoryCode) {
    const categoryMap = {
      'p': 'Plastik Şişe',
      'k': 'Plastik Kavanoz',
      'c': 'Konsept Ürün'
    };
    return categoryMap[categoryCode] || categoryCode; 
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await requestByType(types.allProducts);
        
        if (!response.status === 200) {
          throw new Error("Ürünler çekilemedi.");
        }

        const data = response.data;

        const mappedProducts = data.map((product) => ({
          ...product,
          isSelected: product.isSelected || false,
          displayCategory:getCategoryDisplayName(product.category),
          images: [...product.images]
            .sort((a, b) => a.imageIndex - b.imageIndex)
            .map((img) => ({
              imageUrl: img.imageUrl,
              imageIndex: img.imageIndex,
            })),
        }));

        console.log("mappedProducts:", mappedProducts);
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error("Ürünleri çekme hatası:", error);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  
  const addProduct = () => {
    setSelectedProduct({
      id: null, 
      name: "",
      volume: null,
      category: "", 
      displayCategory: "",
      description: "",
      material:"",
      isBestSeller: false,
      isNewRelease: false,
      isSelected: false,
      images: [],
    });
    setShowEditModal(true); 
  };
  
  const deleteSelectedProducts = () => {
    setProducts(products.filter((p) => !selectedProductIds.includes(p.id)));
    setSelectedProductIds([]);
  };


  const deleteProduct = async (id, e) => {
    e.stopPropagation();
    setProducts(products.filter((p) => p.id !== id));

    const deleteProductResponse = await requestByType(types.deleteProduct, id);
    if (!deleteProductResponse) {
      console.error("Ürün silme başarısız");
    }
  };


  
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


  const tableColumns = [
    {
      header: '',
      accessor: 'isSelected',
      sortable: false,
      onSelectAll: (e) => toggleSelectAll(e),
      allSelected:products.every((p) => p.isSelected),
      cell: (row) => (
        <Form.Check
          type="checkbox"
          checked={selectedProductIds.includes(row.id)}
          onChange={(e) => toggleSelectProduct(row.id, e)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      header: 'Görsel',
      accessor: 'images',
      sortable: false,
      cell: (row) => (
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
          {row.images && row.images.length > 0 ? (
            <img
              src={row.images[0].imageUrl}
              alt={row.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 5,
                verticalAlign: "middle",
              }}
            />
          ) : (
            <i className="ri-image-line text-secondary fs-3"></i>
          )}
        </div>
      ),
    },
    {
      header: 'Ürün Adı',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Hacim',
      accessor: 'volume',
      sortable: true,
    },
    {
      header: 'Kategori',
      accessor: 'displayCategory',
      sortable: true,
    },
    {
      header: 'Malzeme',
      accessor: 'material',
      sortable: true,
    },    
    {
      header: 'Best Seller',
      accessor: 'isBestSeller',
      sortable: true,
      cell: (row) => (row.isBestSeller ? 'Evet' : 'Hayır'),
    },
    {
      header: 'New Release',
      accessor: 'isNewRelease',
      sortable: true,
      cell: (row) => (row.isNewRelease ? 'Evet' : 'Hayır'),
    },
    {
      header: 'Eylemler',
      accessor: 'actions',
      sortable: false,
      cell: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button variant="link" size="sm" onClick={(e) => openEditModal(row, e)} className="p-0 me-2">
            <i className="ri-edit-line fs-4"></i>
          </Button>
          <Button variant="link" size="sm" onClick={(e) => deleteProduct(row.id, e)} className="p-0">
            <i className="ri-delete-bin-line fs-4"></i>
          </Button>
        </div>
      ),
    },
  ];

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

  const removeImage = (img, index) => {
    const updatedImages = selectedProduct.images.filter((_, i) => i !== index);
    setSelectedProduct({
      ...selectedProduct,
      images: updatedImages,
    });

    setImagesToDelete((prevImages) => [...prevImages, img]);
  };


  const moveImageUp = (index) => {
    if (index <= 0) return;
    const updatedImages = [...selectedProduct.images];
    [updatedImages[index - 1], updatedImages[index]] = [updatedImages[index], updatedImages[index - 1]];
    updatedImages[index].newIndex = index;
    updatedImages[index - 1].newIndex = index - 1;
    setSelectedProduct({
      ...selectedProduct,
      images: updatedImages,
    });
  };

  const moveImageDown = (index) => {
    if (index >= selectedProduct.images.length - 1) return;
    const updatedImages = [...selectedProduct.images];
    [updatedImages[index], updatedImages[index + 1]] = [updatedImages[index + 1], updatedImages[index]];
    updatedImages[index].newIndex = index;
    updatedImages[index + 1].newIndex = index + 1;
    setSelectedProduct({
      ...selectedProduct,
      images: updatedImages,
    });
  };

  const toggleSelectProduct = (id, e) => {
    e.stopPropagation();
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(pid => pid !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };
  

  
  const toggleSelectAll = (e) => {
    e.stopPropagation();
    if (selectedProductIds.length === products.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.map((p) => p.id));
    }
  };

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
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
      const preparedProductData = {
        name: selectedProduct.name,
        volume: selectedProduct.volume,
        material:selectedProduct.material,
        category: selectedProduct.category,
        description: selectedProduct.description,
        isBestSeller: selectedProduct.isBestSeller,
        isNewRelease: selectedProduct.isNewRelease,
        isSelected: selectedProduct.isSelected,
      };

      for (const key in preparedProductData) {
        if (preparedProductData[key] === null || preparedProductData[key] === "") {
          alert("Ürün bilgileri eksik");
          throw new Error("Ürün bilgileri eksik");
        }
      }

      const response = selectedProduct.id 
        ? 
          await requestByType(types.updateProduct, {
            id: selectedProduct.id,
            ...preparedProductData
          }) 
        :
          await requestByType(types.createProduct, preparedProductData);
      
      if (!response && !response.data.name) {
        throw new Error("Ürün kaydetme başarısız");
      }

      const processedImages = await Promise.all(
        selectedProduct.images.map(async (img) => {
          console.log("img:", img);
          if (img.imageUrl.startsWith('blob') || img.newIndex !== undefined) {
            if(img.newIndex !== undefined) {
              const repositionResponse = await requestByType(types.repositionProductImage, {
                productId: selectedProduct.id ? selectedProduct.id : response.data.id,
                imageDriveId: extractImageDriveIdFromURL(img.imageUrl),
                newIndex: img.newIndex
              });
              if (!repositionResponse) {
                throw new Error("Görsel sıralama başarısız");
              }

              const repositionedImage = repositionResponse.data;

              return {
                ...img,
                name: repositionedImage.name,
                driveId: repositionedImage.driveId,
              }
            }

            const formData = new FormData();
            formData.append("productId", selectedProduct.id ? selectedProduct.id : response.data.id);
            formData.append("name", selectedProduct.name ? selectedProduct.name : `${response.data.name}-${img.image.name}`);
            formData.append("altDescription", `Product Image of ${selectedProduct.name ? selectedProduct.name : response.data.name}`);
            formData.append("image", img.image);
            
            const uploadResponse = await requestByType(types.uploadProductImage, formData);

            if (uploadResponse.status !== 200) {
              throw new Error("Görsel yükleme başarısız");
            }

            const uploadedImage = await uploadResponse.json();
            
            return {
              ...img,
              name: uploadedImage.name,
              driveId: uploadedImage.driveId, 
            };
          }
          return img;
        })
      );

      imagesToDelete.forEach(async (img) => {
        if(!img.imageUrl.startsWith('blob')){
          const deleteResponse = await requestByType(types.deleteProductImage, {
            productId: selectedProduct.id ? selectedProduct.id : response.data.id,
            imageDriveId: extractImageDriveIdFromURL(img.imageUrl)
          });

          if (!deleteResponse) {
            throw new Error("Görsel silme başarısız");
          }
        }
      });
  
      const savedProduct = {
        ...response.data,
        images: processedImages,
      };
  
      setProducts(selectedProduct.id 
        ? 
          products.map((p) => (p.id === savedProduct.id ? savedProduct : p)) 
        : 
          [...products, savedProduct]
      );
      
      closeEditModal();
    } catch (error) {
      console.error("Ürün kaydedilirken hata:", error);
    }
  };
  
  
  const extractImageDriveIdFromURL = (url) => {
    const splitUrl = url.split('/');
    return splitUrl[splitUrl.length - 1];
  }

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
              <DynamicTable
              data={products}
              columns={tableColumns}
              onRowClick={openDetailModal}
              initialItemsPerPage={20}

            />
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={closeEditModal}>

        <Modal.Header className="bg-primary" closeButton>
        <Modal.Title className="text-white">
          {selectedProduct && !selectedProduct.id ? "Yeni Ürün Ekle" : "Ürünü Düzenle"}
        </Modal.Title>

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
  <Form.Select 
    name="category"
    value={selectedProduct.category} 
    onChange={(e) => {
      const value = e.target.value;
      setSelectedProduct({
        ...selectedProduct,
        category: value,
        displayCategory: getCategoryDisplayName(value)
      });
    }}
  >
    <option disabled value="">Kategori Seçin</option>
    <option value="p">Plastik Şişe</option>
    <option value="k">Plastik Kavanoz</option>
    <option value="c">Konsept Ürün</option>
  </Form.Select>
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

              <Form.Group controlId="editProductMaterial" className="mb-3">
              <Form.Label>Malzeme</Form.Label>
              <Form.Control
                type="text"
                name="material"
                value={selectedProduct.material || ""}
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

                      <Button
                        variant="light"
                        size="sm"
                        style={{ position: 'absolute', top: '2px', right: '2px' }}
                        onClick={() => removeImage(img, index)}
                      >
                        <i className="ri-close" style={{ fontSize: '1.8rem', color: '#dc3545', zIndex:10 }}></i>
                      </Button>
              
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
                <strong>Kategori:</strong> {selectedProduct.displayCategory}
              </p>
              <p>
              <strong>Malzeme:</strong> {selectedProduct.material}
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