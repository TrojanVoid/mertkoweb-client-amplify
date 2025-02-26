import React from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Main from './panel/layouts/Main';
import Signin from "./panel/pages/Signin";
import Signup from "./panel/pages/Signup";

import publicRoutes from "./panel/routes/PublicRoutes";
import protectedRoutes from "./panel/routes/ProtectedRoutes";

// import css
import "./panel/assets/css/remixicon.css";

// import scss
import "./panel/scss/style.scss";


const App = () => {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="anasayfa" element={<Home />} />
      <Route path="hakkimizda" element={<About />} />
      <Route path="bloglar" element={<Blogs />} />
      <Route path="iletisim" element={<Contact />} />
      <Route path="blog/detail" element={<BlogDetail />} />
      <Route path="urun-detay" element={<ProductDetail />} />
      <Route path="urunler" element={<Products />} />
      <Route path="urunler/:productId" element={<ProductDetail />} />
      
      <Route path="/panel" element={<Main />}>
              {protectedRoutes.map((route, index) => {
                return (
                  <Route
                    path={route.path}
                    element={route.element}
                    key={index}
                  />
                );
              })}
            </Route>
            {publicRoutes.map((route, index) => {
              return (
                <Route
                  path={route.path}
                  element={route.element}
                  key={index}
                />
              );
            })}
            <Route path="/panel/signin" element={<Signin />} />
            <Route path="/panel/signup" element={<Signup />} />
            <Route path="*" element={<Home />} />
     
    </Routes>
  );
};

export default App;
