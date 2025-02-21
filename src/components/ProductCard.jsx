import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../style/components/product-card.scss";
import { types, requestByType } from "../apis/ProductApi";

const ProductCard = ({ product, isDetailed = false }) => {
  const { id, name } = product;
  const [images, setImages] = useState([]);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await requestByType(types.productImages, id);
        setImages(response.data.images); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  return (
    <Link to={`/products/${id}`} className="product-card-link">
      <Card className="product-card">
        {loading ? (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Card.Img variant="top" src={images[0]} alt={name} />  
        )}

        {(!loading && isDetailed) && (
          <Card.Body>
            <Card.Title>{name}</Card.Title>
          </Card.Body>
        )}
      </Card>
    </Link>
  );
};

export default ProductCard;
