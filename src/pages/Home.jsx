import React from 'react';
import Layout from '../global/Layout';
import "../style/pages/Home.scss";
import DynamicCarousel from '../components/DynamicCarousel';
import MainSlider from '../components/MainSlider';
import ProductSlider from '../components/ProductSlider';
import ProductTab from '../components/ProductTab';
import Contact from '../components/Contact';
import Benefit from '../components/Benefit';
import { useState, useEffect } from 'react';
import LocationMap from '../components/LocationMap';

const AboutContent = require("../data/AboutContent.json");

const Home = () => {

  /* window.addEventListener('scroll', detectActiveTab);
  window.addEventListener('resize', detectActiveTab);


  document.addEventListener('DOMContentLoaded', detectActiveTab); */
  
  return (
    <Layout>
        <div id="home" className="page-label disabled">
          <h3>
            Ana Sayfa
          </h3>
        </div>
        <div className="home-page d-flex flex-column justify-content-center align-items-center">
          <div className="carousel-container w-100">
            <MainSlider />
          </div>
        

          <ProductTab>

          </ProductTab>



            <div className="about-container w-full">
                <div className="text flex items-center justify-center">
                    <div className="content md:w-5/6 w-full">
                    
                        <h1 className="heading3 text-center mt-5">
                            {
                              /* AboutContent["title"] */
                              
                            }
                            HAKKIMIZDA
                        </h1>

                        <div className="w-100 d-flex flex-row justify-between align-items-center gap-[10rem]">
                          <div className="body1 text-center md:mt-7 mt-5 w-50">
                              {
                                AboutContent["content1"].split(' ').map((item, index) => {
                                  if(item == "<br/>") return (<br/>)
                                  return item + " "; 
                                })
                              }
                          </div>

                          <div className="body1 text-center md:mt-7 mt-5 w-50">
                              {
                                AboutContent["content2"].split(' ').map((item, index) => {
                                  if(item == "<br/>") return (<br/>)
                                  return item + " "; 
                                })
                              }
                          </div>
                        </div>
                        
                    </div>
                </div>
                <div className="list-img grid sm:grid-cols-3 gap-[30px] md:pt-20 pt-10">
                    <div className="bg-img">
                        <img
                            src={'/images/other/about-us1.png'}
                            width={2000}
                            height={3000}
                            alt='bg-img'
                            className='w-full rounded-[30px]'
                        />
                    </div>
                    <div className="bg-img">
                        <img
                            src={'/images/other/about-us2.png'}
                            width={2000}
                            height={3000}
                            alt='bg-img'
                            className='w-full rounded-[30px]'
                        />
                    </div>
                    <div className="bg-img">
                        <img
                            src={'/images/other/about-us3.png'}
                            width={2000}
                            height={3000}
                            alt='bg-img'
                            className='w-full rounded-[30px]'
                        />
                    </div>
                </div>
                <LocationMap />
            </div>

            {/* <Contact /> */} // TODO: Maybe re-implement this?
            <Benefit>

            </Benefit>

        </div>
    </Layout>
  );
};

/* 
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
}; */


export default Home;
