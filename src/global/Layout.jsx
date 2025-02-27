import React from 'react';
import Header from '../components/header/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout main-site">
      <Header />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;