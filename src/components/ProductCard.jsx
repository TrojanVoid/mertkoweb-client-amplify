import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../style/components/ProductCard.scss";

const ProductCard = ({ product, isDetailed = false }) => {
  const { id, name } = product;
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://0obkhvr5j4.execute-api.eu-north-1.amazonaws.com/prod/api/product-image/${id}`);
        setImage(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image:', error);
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  return (
    <Link to={`/products/${id}`} className="product-card-link">
      <Card className="product-card">
        {loading ? (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Card.Img variant="top" src={image} alt={name} />
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
