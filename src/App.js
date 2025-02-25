import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="anasayfa" element={<Home />} />
      <Route path="hakkimizda" element={<About />} />
      <Route path ="blogs" element={<Blogs />} />
      <Route path="blog/detail" element={<BlogDetail />} />
      <Route path="urun-detay" element={<ProductDetail />} />
      <Route path="urunler" element={<Products />} />
      <Route path="urunler/:productId" element={<ProductDetail />} />
    </Routes>
  );
};

export default App;
