import React, { useEffect, useState } from 'react';
import { Carousel, Spinner } from 'react-bootstrap';
import axios from 'axios';
import "../style/components/DynamicCarousel.scss";

const DynamicCarousel = () => {
  const [imageUrls, setImageUrls] = useState([]);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('https://xvncvkcbxjfshtpvdx4fbl522i0kcjca.lambda-url.eu-north-1.on.aws/api/carousel-images');
      setImageUrls(response.data.imageUrls); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="loading-container d-flex justify-content-center align-items-center">
        <img
          src="/resources/images/carousel_loading_image.jpg"
          alt="Loading"
          className="loading-image"
        />
        <Spinner animation="border" />  
      </div>
    );
  }

  return (
    <Carousel controls={true} indicators={false} interval={5000}>
      {imageUrls.map((url, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={url} 
            alt={`Slide ${index}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default DynamicCarousel;
