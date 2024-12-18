  import React, { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { Container, Row, Col, Form, Button } from 'react-bootstrap';
  import axios from 'axios';
  import ProductCard from '../components/ProductCard';
  import Layout from '../components/Layout';
  import "../style/pages/Products.scss";

  const SECTION_TAB_MAP = {
      'home': 0,
      'about': 1,
      'products': 2,
      'contact': 3,
  };

  const Products = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const validTypes = ['sise', 'kavanoz', 'konsept'];
    const [products, setProducts] = useState([]);
    const [sortByVolume, setSortByVolume] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth > 768 ? 48 : 20);

    useEffect(() => {
      if (!validTypes.includes(type)) {
        navigate('/');
        return null;
      }
    });
    

    useEffect(() => {
      const navLinks = document.querySelectorAll('.navbar-nav a');
      navLinks.forEach((link, index) => {
        if (index === SECTION_TAB_MAP['products']) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/products?type=${type}`);
          setProducts(response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };

      fetchProducts();
    }, [type]);

    const sortedProducts = products.slice().sort((a, b) => {
      if (sortByVolume === 'asc') return a.volume - b.volume;
      if (sortByVolume === 'desc') return b.volume - a.volume;
      return 0;
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);


    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    return (
      <Layout>
        <Container fluid className="products-page h-100 d-flex justify-content-center align-items-center">
          <Row className="d-flex h-100 flex-column justify-content-center align-items-center">

            <Row md={3} className="filters-section w-100 d-flex justify-content-center align-items-center">
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setSortByVolume('asc')}
              >
                Artan Hacime Göre Sırala
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => setSortByVolume('desc')}
              >
                Azalan Hacime Göre Sırala
              </Button>
            </Row>

            <Row className="d-flex w-100 flex-wrap justify-content-center align-items-center" md={9}>
              <Row className="gallery d-flex w-100 justify-content-center align-items-center">
                {currentProducts.map(product => (
                  <Col 
                    key={product.id} 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    className={`mb-4 product-container`}
                  >
                    <ProductCard product={product} isDetailed={true} />
                  </Col>
                ))}
              </Row>
            </Row>

            {/* Pagination Controls */}
            <Row className="w-100 d-flex align-items-center pagination-container justify-content-center mt-2 pt-2 pb-2">
              <div className="w-50 d-flex justify-content-center align-items-center flex-wrap pagination-buttons">
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button 
                    key={index + 1} 
                    variant="outline-primary" 
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
            </Row>

          </Row>
        </Container>
      </Layout>
    );
  };

  export default Products;
