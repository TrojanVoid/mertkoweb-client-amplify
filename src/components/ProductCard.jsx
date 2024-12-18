import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../style/components/ProductCard.scss";

const TYPE_MAP = {
  "p": "sise",
  "c": "konsept",
  "k": "kavanoz",
  "h" : "hemen"
}

const ProductCard = ({ product, isDetailed = false }) => {
  const { id, name, volume, category } = product;
  const [images, setImages] = useState([]);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/product-images/${id}`);
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
    <Link to={`/products/${TYPE_MAP[category]}/${id}`} className="product-card-link">
      <Card className="product-card">
        {loading ? (
          <div className="spinner-wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Card.Img variant="top" src={images[0]} alt={name} referrerPolicy='no-referrer' />  
        )}

        {(!loading && isDetailed) && (
          <Card.Body>
            <Card.Title>{`${name} ${volume} mL`}</Card.Title>
          </Card.Body>
        )}
      </Card>
    </Link>
  );
};

export default ProductCard;
