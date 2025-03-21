import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

import Layout from '../global/Layout';
import "../style/pages/products.scss";
import {types, requestByType} from "../apis/ProductApi";

const SECTION_TAB_MAP = {
    'home': 0,
    'about': 1,
    'products': 2,
    'contact': 3,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortByVolume, setSortByVolume] = useState(null);
  const [petChecked, setPetChecked] = useState(false);
  const [conceptChecked, setConceptChecked] = useState(false);

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
        const response = await requestByType(types.allProducts);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const shouldHideProduct = (product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = (petChecked && product.isPet) || 
                            (conceptChecked && product.isConcept) || 
                            (!petChecked && !conceptChecked);
    return !(matchesSearch && matchesCategory);
  };

  const sortedProducts = products.slice().sort((a, b) => {
    if (sortByVolume === 'asc') return a.volume - b.volume;
    if (sortByVolume === 'desc') return b.volume - a.volume;
    return 0;
  });

  return (
    <Layout>
      <Container fluid className="products-page h-100 d-flex justify-content-center align-items-center">
        <Row className="d-flex h-100 justify-content-center align-items-start">
          <Col md={3} className="filters-section h-100 d-flex flex-column justify-content-start align-items-start">
            <Form.Group controlId="searchInput">
              <Form.Control
                type="text"
                placeholder="Ürün ismine göre ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="checkboxGroup" className="mt-3">
              <Form.Check
                type="checkbox"
                label="PET Ürünleri"
                checked={petChecked}
                onChange={() => setPetChecked(!petChecked)}
              />
              <Form.Check
                type="checkbox"
                label="Konsept Ürünleri"
                checked={conceptChecked}
                onChange={() => setConceptChecked(!conceptChecked)}
              />
            </Form.Group>

            <div className="sorting mt-3">
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
            </div>
          </Col>

          <Col className="d-flex w-75 flex-wrap justify-content-center align-items-center" md={9}>
            <Row className="gallery d-flex w-100 justify-content-start align-items-start">
              {sortedProducts.map(product => (
                <Col 
                  key={product.id} 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  className={`mb-4 ${shouldHideProduct(product) ? 'hidden' : ''}`}
                >
                  <ProductCard product={product} isDetailed={true} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Products;
