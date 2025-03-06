import React from 'react';
import { BrowserRouter ,Routes, Route } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Main from './panel/layouts/Main';
import Signin2 from './panel/pages/Signin2';
import Signup from "./panel/pages/Signup";

import { UserProvider } from './panel/context/UserContext';
import publicRoutes from "./panel/routes/PublicRoutes";
import protectedRoutes from "./panel/routes/ProtectedRoutes";


// import css
import "./panel/assets/css/remixicon.css";
// import scss
import "./panel/scss/style.scss";

const App = () => {
  return (
    <HelmetProvider>
      <UserProvider>
        <Routes>
          {/* Mertko Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="anasayfa" element={<Home />} />
          <Route path="hakkimizda" element={<About />} />
          <Route path="bloglar" element={<Blogs />} />
          <Route path="iletisim" element={<Contact />} />
          <Route path="blog" element={<BlogDetail />} />
          <Route path="urun-detay" element={<ProductDetail />} />
          <Route path="urunler" element={<Products />} />

          {/* Panel Routes */}
          <Route path="panel" element={<Main/>} />
          <Route path="dashboard" element={<Main />}>
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
          <Route path="/admin" element={<Signin2 />} />
          <Route path="/panel/signup" element={<Signup />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </UserProvider>
    </HelmetProvider>
  );
};

export default App;
