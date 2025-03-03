import React, { useEffect, useState } from "react";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Link } from "react-router-dom";
import { requestByType, types } from "../../apis/BlogApi";

export default function HelpdeskService() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state'leri
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

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
    if (!window.confirm("Bu blog yazısını silmeye emin misiniz?")) return;
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
    const { name, value } = e.target;
    setSelectedBlog({
      ...selectedBlog,
      [name]: value,
    });
  };

  const handleUpdateBlog = async () => {
    try {
      const response = await requestByType(types.updateBlog, selectedBlog);
      const updatedBlog = response.data;
      if (!updatedBlog) {
        alert("Güncellenen blog verisi alınamadı.");
        return;
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
      const response = await requestByType(types.createBlog, selectedBlog);
      setBlogs([...blogs, response.data]);
      setShowCreateModal(false);
      setSelectedBlog(null);
    } catch (err) {
      console.error("Blog oluşturulurken hata:", err);
      alert("Blog oluşturulurken hata oluştu.");
    }
  };

  return (
    <>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container">
          <ol className="breadcrumb fs-sm mb-1">
            <li className="breadcrumb-item">
              <Link to="#">Dashboard</Link>
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
                      onClick={() => handleDeleteBlog(blog.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{blog.content}</Card.Text>
                  <Link to={`/blog?id=${blog.id}`}>Detaylar</Link>
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
        onHide={() => setShowEditModal(false)}
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
              <Form.Group controlId="editBlogContent" className="mb-3">
                <Form.Label>İçerik</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  value={selectedBlog.content}
                  onChange={handleBlogChange}
                />
              </Form.Group>
              {/* Eğer görseller için alan eklemek isterseniz burada ekleyebilirsiniz */}
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
        onHide={() => setShowCreateModal(false)}
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
              <Form.Group controlId="createBlogContent" className="mb-3">
                <Form.Label>İçerik</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  value={selectedBlog.content}
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
