import React, { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { requestByType, types } from "../../apis/BlogApi";
import{ useConfirm } from '../context/ConfirmContext';

export default function Blog() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirm } = useConfirm();
  const editor = useCreateBlockNote();

  // Modal state'leri
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const injectBlogContent = async () => {
      if (editor && selectedBlog && showEditModal) {
        try {
          editor.insertBlocks(JSON.parse(selectedBlog.content), editor.document[0]);
          
        } catch (err) {
          console.error("Failed to parse and inject blog content:", err);
        }
      }
    };
  
    if(!showEditModal) return;
      emptyEditor().then(injectBlogContent());
    
  }, [showEditModal]);

  useEffect(() => {
    if(!showCreateModal) return;
      emptyEditor();
  }, [showCreateModal]);

  const emptyEditor = async () => {
    if(editor && editor.document.length > 0){
      try{
        editor.removeBlocks(editor.document);
      }
      catch(err){
        console.error(`Failed to empty the editor: ${err}`);
      }
    }
  }

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await requestByType(types.getBlogs);
      setBlogs(response.data);
    } catch (err) {
      console.error("Bloglar çekilirken hata:", err);
      setError("Bloglar yüklenirken hata oluştu.");
    }
    setLoading(false);
  };

  // Blog silme
  const handleDeleteBlog = async (blogId) => {
    try {
      await requestByType(types.deleteBlog, blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error("Blog silinirken hata:", err);
      alert("Blog silinirken bir hata oluştu.");
    }
  };

  // Blog düzenleme modali aç
  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setShowEditModal(true);
  };

  // Blog oluşturma modali aç
  const openCreateModal = () => {
    setSelectedBlog({
      title: "",
      author: "",
      content: "",
      images: [],
    });
    setShowCreateModal(true);
  };

  const handleBlogChange = (e) => {
    if(!e || !e.target) return;
    const { name, value } = e.target;
    setSelectedBlog({
      ...selectedBlog,
      [name]: value,
    });
  };

  const handleUpdateBlog = async () => {
    try {
      const serializedContent = await JSON.stringify(editor.document);

      const response = await requestByType(types.updateBlog, {
        ...selectedBlog,
        content: serializedContent
      });

      const updatedBlog = response.data;

      // Delete server-side image if flagged
      if (selectedBlog.markImageForDeletion) {
        await requestByType(types.deleteBlogImages, updatedBlog.id);
      }

      // Upload new image if added
      if (selectedBlog.imageFile) {
        await requestByType(types.uploadBlogImage, {
          id: updatedBlog.id,
          image: selectedBlog.imageFile
        });
      }

      setBlogs(blogs.map((b) => (b.id === selectedBlog.id ? updatedBlog : b)));
      setShowEditModal(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error("Blog güncellenirken hata:", err);
      alert("Blog güncellenirken hata oluştu.");
    }
  };

  const handleCreateBlog = async () => {
    try {
      const serializedContent = await JSON.stringify(editor.document);
      const response = await requestByType(types.createBlog, {
        ...selectedBlog,
        content: serializedContent
      });
      const createdBlog = response.data;

      if (selectedBlog.imageFile) {
        await requestByType(types.uploadBlogImage, {
          id: createdBlog.id,
          image: selectedBlog.imageFile
        });
      }

      setBlogs([...blogs, createdBlog]);
      setShowCreateModal(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error("Blog oluşturulurken hata:", err);
      alert("Blog oluşturulurken hata oluştu.");
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedBlog(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedBlog(null);
  };

  return (
    <>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container">
          <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link to="/panel">Panel</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Bloglar
            </li>
          </ol>
          <h1 className="mb-4">Blog Yönetimi</h1>
          <Button variant="primary" onClick={openCreateModal} className="mb-3">
            Yeni Blog Ekle
          </Button>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : blogs.length === 0 ? (
            <p>Henüz blog yazısı yok.</p>
          ) : (
            blogs.map((blog) => (
              <Card key={blog.id} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>{blog.title}</span>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openEditModal(blog)}
                      className="me-2"
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={async () => {
                        // Kullanıcıdan onay alıyoruz
                        const result = await confirm("Bu blog yazısını silmek istediğinize emin misiniz?");
                        if (result) {
                          handleDeleteBlog(blog.id); // Eğer onaylandıysa, silme işlemini yapıyoruz
                        }
                      }}
                    >
                      Sil
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {/* <Card.Text>{blog.content}</Card.Text> */}
                  <Link to={`/blog?id=${blog.id}`}>İçeriği Görüntüle</Link>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Blog Düzenleme Modal'i */}
      <Modal 
        className="w-full" 
        show={showEditModal} 
        onHide={closeEditModal}
        dialogClassName="w-[90%] max-w-[90%]"
      >
        <Modal.Header closeButton>
          <Modal.Title>Blog Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBlog && (
            <Form>
              <Form.Group controlId="editBlogTitle" className="mb-3">
                <Form.Label>Başlık</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedBlog.title}
                  onChange={handleBlogChange}
                />
              </Form.Group>
              <Form.Group controlId="editBlogAuthor" className="mb-3">
                <Form.Label>Yazar</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={selectedBlog.author}
                  onChange={handleBlogChange}
                />
              </Form.Group>

              {(selectedBlog?.imageFile || selectedBlog?.images?.length > 0) && (
                <div className="mb-3">
                  <div className="position-relative d-inline-block">
                    <img
                      src={
                        selectedBlog.imageFile
                          ? URL.createObjectURL(selectedBlog.imageFile)  // Local temp file
                          : selectedBlog.images[0]?.imageUrl             // Existing uploaded image from the server
                      }
                      alt={selectedBlog.images?.[0]?.altDescription || "Blog Görseli"}
                      className="img-fluid mb-2"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => {
                        setSelectedBlog(prev => {
                          const updated = { ...prev };

                          if (updated.imageFile) {
                            delete updated.imageFile;
                          } 
                          if (updated.images?.length > 0) {
                            updated.images = [];
                            updated.markImageForDeletion = true;
                          }

                          return updated;
                        });
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}
              <Form.Group controlId="blogImage" className="mb-3">
                <Form.Label>Görsel Yükle</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files[0]) return;
                    setSelectedBlog(prev => ({
                      ...prev,
                      imageFile: e.target.files[0]
                    }));
                  }}
                />
              </Form.Group>

              <Form.Group controlId="editBlogContent" className="mb-3">
                <Form.Label>İçerik</Form.Label>
                <BlockNoteView
                  editor={editor}
                  contentEditable={true}
                  onChange={(val) => {
                    setSelectedBlog(prev => {return{
                      ...prev,
                      content: val
                    }})
                  }}
                />
              </Form.Group>

            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateBlog}>
            Güncelle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Yeni Blog Oluşturma Modal'i */}
      <Modal 
        show={showCreateModal} 
        onHide={closeCreateModal}
        dialogClassName="w-[90%] max-w-[90%]"
      >
        <Modal.Header closeButton>
          <Modal.Title>Yeni Blog Oluştur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBlog && (
            <Form>
              <Form.Group controlId="createBlogTitle" className="mb-3">
                <Form.Label>Başlık</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedBlog.title}
                  onChange={handleBlogChange}
                />
              </Form.Group>
              <Form.Group controlId="createBlogAuthor" className="mb-3">
                <Form.Label>Yazar</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={selectedBlog.author}
                  onChange={handleBlogChange}
                />
              </Form.Group>

              {(selectedBlog?.imageFile || selectedBlog?.images?.length > 0) && (
                <div className="mb-3">
                  <div className="position-relative d-inline-block">
                    <img
                      src={
                        selectedBlog.imageFile
                          ? URL.createObjectURL(selectedBlog.imageFile)  // Local temp file
                          : selectedBlog.images[0]?.imageUrl             // Existing uploaded image
                      }
                      alt={selectedBlog.images?.[0]?.altDescription || "Blog Görseli"}
                      className="img-fluid mb-2"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => {
                        setSelectedBlog(prev => {
                          const updated = { ...prev };
                          if (updated.imageFile) {
                            delete updated.imageFile;
                          } else if (updated.images && updated.images.length > 0) {
                            updated.images = [];
                          }
                          return updated;
                        });
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              )}
              <Form.Group controlId="blogImage" className="mb-3">
                <Form.Label>Görsel Yükle</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files[0]) return;
                    setSelectedBlog(prev => ({
                      ...prev,
                      imageFile: e.target.files[0]
                    }));
                  }}
                />
              </Form.Group>

              <Form.Group controlId="createBlogContent" className="mb-3">
                <Form.Label>İçerik</Form.Label>
                <BlockNoteView
                  editor={editor}
                  contentEditable={true}
                  onChange={handleBlogChange}
                />
              </Form.Group>

            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleCreateBlog}>
            Oluştur
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}
