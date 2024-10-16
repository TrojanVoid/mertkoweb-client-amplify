import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../style/components/ProductCard.scss";

const ProductCard = ({ product, isDetailed = false }) => {
  const { id, name, volume } = product;
  const [imageUrl, setImageUrl] = useState('');  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/product-image/${id}`);
        setImageUrl(response.data.imageUrl); 
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
          <Card.Img variant="top" src={imageUrl} alt={name} referrerPolicy='no-referrer' />  
        )}

        {(!loading && isDetailed) && (
          <Card.Body>
            <Card.Title>{`${name}   ${volume} mL`}</Card.Title>
          </Card.Body>
        )}
      </Card>
    </Link>
  );
};

export default ProductCard;
