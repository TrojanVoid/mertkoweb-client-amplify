import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import ProductCard from './ProductCard';

import "../style/components/ProductSlider.scss";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://hoyzrufexe.execute-api.eu-north-1.amazonaws.com/prod/api/concept-products');
        console.log("products response:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    arrows: false, 
  };

  return (
    <div className="product-slider">
      <Slider {...settings}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
