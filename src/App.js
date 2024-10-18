import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:type" element={<Products />} />
      <Route path="/products/:type/:productId" element={<ProductDetail />} />
    </Routes>
  );
};

export default App;
