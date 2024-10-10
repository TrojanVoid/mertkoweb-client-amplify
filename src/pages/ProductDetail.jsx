import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import "../style/pages/ProductDetail.scss";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => { 
      try {
        const response = await axios.get(`https://hoyzrufexe.execute-api.eu-north-1.amazonaws.com/prod/api/product-image/${productId}`);
        setImage(response.data);
      } catch (error) {
        setError('Error fetching product image');
        console.error(error);
      } finally {
        setIsImageLoading(false); 
      }
    };

    fetchImage();
  }, [productId]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://hoyzrufexe.execute-api.eu-north-1.amazonaws.com/prod/api/get-product/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching product details');
        setLoading(false);
        console.error(error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  let content = null;

  if (loading) {
    content = (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    content = (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Layout>
      <Container className="product-detail-page">
        {(loading || error) && content}
        {(!loading && !error) && 
          (<Row className="justify-content-center">
            <Col md={6} className="position-relative">
              {isImageLoading && (
                <div className="spinner-wrapper w-100 h-100 d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
              {!isImageLoading && (
                <Image 
                    src={image} 
                    alt={product?.name} 
                    fluid 
                    className="product-image" 
                    onLoad={() => setIsImageLoading(false)} 
                    onError={() => setIsImageLoading(false)}
                />
              )}
              
            </Col>
            <Col md={6} className="product-info">
              <h1>{product?.name}</h1>
              <p><strong>Kategori:</strong> {product?.category}</p>
              <p><strong>Hacim:</strong> {product?.volume} mL</p>
              <p><strong>Açıklama:</strong> {product?.description}</p>
            </Col>
          </Row>)
        }
      </Container>
    </Layout>
  );
};

export default ProductDetail;
