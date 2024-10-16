import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Image, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';
import "../style/pages/ProductDetail.scss";

const CATEGORY_MAP = {
  "p": "Şişe",
  "c": "Konsept",
  "k": "Kavanoz",
}

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageRef = useRef(null); 

  useEffect(() => {
    const fetchImage = async () => { 
      try {
        const response = await axios.get(`https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/product-image/${productId}`);
        setImageUrl(response.data.imageUrl); 
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
        const response = await axios.get(`https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/get-product/${productId}`);
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

  const handleFullScreen = () => {
    if (imageRef.current) {
      if (imageRef.current.requestFullscreen) {
        imageRef.current.requestFullscreen();
      } else if (imageRef.current.mozRequestFullScreen) { // For Firefox
        imageRef.current.mozRequestFullScreen();
      } else if (imageRef.current.webkitRequestFullscreen) { // For Chrome, Safari, and Opera
        imageRef.current.webkitRequestFullscreen();
      } else if (imageRef.current.msRequestFullscreen) { // For IE/Edge
        imageRef.current.msRequestFullscreen();
      }
    }
  };

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
                    ref={imageRef} 
                    src={imageUrl} 
                    alt={product?.name} 
                    fluid 
                    className="product-image" 
                    onClick={handleFullScreen} 
                />
              )}
            </Col>
            <Col md={6} className="product-info">
              <h1>{product?.name}</h1>
              <p><strong>Kategori:</strong> {CATEGORY_MAP[product?.category]}</p>
              <p><strong>Hacim:</strong> {product?.volume} mL</p>
            </Col>
          </Row>)
        }
      </Container>
    </Layout>
  );
};

export default ProductDetail;
