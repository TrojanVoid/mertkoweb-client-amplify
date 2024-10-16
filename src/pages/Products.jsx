import React, { useEffect, useState } from 'react';
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
        const response = await axios.get('https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/products');
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
        <Row className="d-flex h-100 flex-column justify-content-center align-items-start">
          
          <Row md={3} className="filters-section w-100 d-flex justify-content-start align-items-center">
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
          </Row>
        </Row>
      </Container>
    </Layout>
  );
};

export default Products;
