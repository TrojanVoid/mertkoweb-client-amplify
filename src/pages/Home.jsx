import React from 'react';
import Layout from '../components/Layout';
import "../style/pages/Home.scss";
import DynamicCarousel from '../components/DynamicCarousel';
import ProductSlider from '../components/ProductSlider';
import Contact from '../components/Contact';
import { useState, useEffect } from 'react';

const SECTION_TAB_MAP = {
  'home': 0,
  'about': 1,
  'products': 2,
  'contact': 3,
};

const Home = () => {
  window.addEventListener('scroll', detectActiveTab);
  window.addEventListener('resize', detectActiveTab);


  document.addEventListener('DOMContentLoaded', detectActiveTab);
  
  return (
    <Layout>
        <div id="home" className="page-label disabled">
          <h3>
            Ana Sayfa
          </h3>
        </div>
        <div className="home-page d-flex flex-column justify-content-center align-items-center">
          <div className="carousel-container w-100">
            <DynamicCarousel />
          </div>
        

            <div className="concept-products w-75 d-flex justify-content-between align-items-center">
              <h4 className="concept-products-title">
                KONSEPT ÜRÜNLER
              </h4>

              <div className="concept-products-list-container d-flex overflow-auto">
                <ProductSlider />
              </div>
            </div>


            <div id="about" className="page-label">
              <h3>
                Hakkımızda
              </h3>
            </div>

            <section className="about w-100 d-flex justify-content-center align-items-center">
              <div className="about-wrapper w-75 d-flex flex-wrap justify-content-between align-items-center">
                
                <div className="about-section col-12 col-md-6 d-flex flex-column justify-content-start align-items-start">
                  <div className="title-container w-100 d-flex justify-content-between align-items-center flex-grow">
                    <h3 className="title red">Mertko Plastik</h3>
                    <div className="title-line red"></div>
                  </div>
                  <p>
                    Kurulduğu yıl olan 1980 yılından bu yana firmamız, güven dolu geçmişi ile plastik ambalaj ürünleri ile kozmetik 
                    sektörüne ışık tutmaya devam etmektedir. <br/><br/>  Konusunda uzman kadromuz ile, kozmetik sektörü başta olmak üzere; plastik 
                    ambalaja ihtiyaç duyulan tüm sektörlerde en ön sayfa katılımı icra ediyoruz. <br/><br/> Fabrikamızda 6 adet Normal Şişirme, 
                    3 adet Pet Şişirme, 10 adet Normal Enjeksiyon, 2 adet Pet Enjeksiyon, sıcak varak baskı, serigrafi baskı üniteleri 
                    ve makineleri 50 kişilik deneyimli personeli, kendi kalıp atölyemiz ve uzman grafiker kadromuz değerlendirme ve 
                    bilişim bölümümüz ile faaliyet göstermekteyiz.
                  </p>
                </div>

                <div className="about-section col-12 col-md-6 d-flex flex-column justify-content-start align-items-start">
                  <div className="title-container w-100 d-flex justify-content-between align-items-center flex-grow">
                    <h3 className="title">Tescilli Ürünler</h3>
                    <div className="title-line"></div>
                  </div>
                  <p>
                    Mertko Plastik Ürünleri San. Tic. Ltd. Şti, üretimini yaptığı ve bünyesinde barındırdığı her ürünün tesciline sahiptir. 
                    Herhangi bir taklit korkusu olmadan müşterilerimizin beğenisine sunduğumuz ürünler gönül rahatlığı ile pazarlanabilirler. 
                    Bu konuda da firmamız ile yapacağınız anlaşmalarda bu avantajı da göz ardı etmemeniz rica olunur. <br/><br/> Yurt içinde ve yurt 
                    dışında yüzlerce sayıdaki müşteri portföyümüz, 500’e yakın ürün yelpazemiz ile tüm siparişleriniz tarafınıza garantili 
                    olarak teslim edilir. İstanbul içi alımlarınızda teslimat, firmamızca yapılmaktadır. Anadolu ve Trakya bölgelerindeki 
                    firmalarımız için ise, anlaşmalı oldukları ya da firmamızın anlaşmalı olduğu ambarlar ve kargo firmaları ile teslimat 
                    yapılmaktadır.
                  </p>
                </div>
              </div>
            </section>

            <Contact />


        </div>
    </Layout>
  );
};


const detectActiveTab = () => {
  const sections = Object.keys(SECTION_TAB_MAP).map(id => document.getElementById(id));
  let activeIndex = 0;

  sections.forEach((section, index) => {
    if (section) {
      const rect = section.getBoundingClientRect();
      const isActive = rect.top <= window.innerHeight / 2;
      if (isActive) {
        activeIndex = SECTION_TAB_MAP[section.id];
      }
    }
  });

  const navLinks = document.querySelectorAll('.navbar-nav a');
  navLinks.forEach((link, index) => {
    if (index === activeIndex) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};


export default Home;
