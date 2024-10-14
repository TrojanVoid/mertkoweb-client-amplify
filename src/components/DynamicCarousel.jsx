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
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        setImageUrls(response.data); 
      } else {
        console.error('Response data is not an array:', response.data);
        setImageUrls([]);
      }
      
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
      {imageUrls.length > 0 ? ( 
        imageUrls.map((url, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={url} 
              alt={`Slide ${index}`}
              referrerPolicy='no-referrer'
            />
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <h5>No images available</h5>
          </div>
        </Carousel.Item>
      )}
    </Carousel>
  );
};

export default DynamicCarousel;
