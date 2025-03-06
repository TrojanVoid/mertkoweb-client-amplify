import React from 'react';
import Layout from '../global/Layout';
import "../style/pages/home.scss";
import DynamicCarousel from '../components/DynamicCarousel';
import MainSlider from '../components/MainSlider';
import ProductSlider from '../components/ProductSlider';
import ProductTab from '../components/ProductTab';
import Contact from '../components/Contact';
import Benefit from '../components/Benefit';
import { useState, useEffect } from 'react';
import LocationMap from '../components/LocationMap';
import withMetaData from '../providers/MetaDataProvider';

const {requestByType, types} = require('../apis/AboutApi');

const Home = () => {

  const [aboutData, setAboutData] = useState([]);

  const fetchAboutData = async() => {
      try {
          const response = await requestByType(types.getAbout);
          setAboutData(response.data);
      } catch (err) {
          console.error("About data fetch error:", err);
      }
  }

  useEffect(() => {
      fetchAboutData();
  }, []);
  
  return (
    <Layout>
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
                          {(aboutData && aboutData.title && aboutData.title.length > 0
                            ? aboutData.title
                            : "HAKKIMIZDA"
                          )}
                        </h1>

                        <div className="w-100 d-flex flex-col md:flex-row justify-between items-center md:items-start gap-[6rem] sm:gap-[3rem] md:gap-[4rem] lg:gap-[6rem] md:mt-10">
                          {/* First Text Block */}
                          <div className="body1 text-center mt-5 md:!mt-7 w-[90%] md:w-1/2 pb-2 md:pb-5">
                              {
                                (aboutData && aboutData.content1 &&
                                  aboutData["content1"].replaceAll('\n', ' <br/> ').split(' ').map((item, index) => {
                                      console.log("item:", item);
                                      if (item.includes("<br/>") ) return (<br key={index} />);
                                      return item + " ";
                                  })
                                )
                              }
                          </div>

                          {/* Divider*/}
                          <div className="md:block self-stretch md:self-stretch w-full h-[0.5px] md:w-[1px] md:h-auto bg-white"></div>

                          {/* Second Text Block */}
                          <div className="body1 text-center mt-2 md:!mt-7 w-[90%] md:w-1/2 pb-5">
                              {
                                (aboutData && aboutData.content2 &&
                                  aboutData["content2"].split(' ').map((item, index) => {
                                      if (item === "<br/>") return (<br key={index} />);
                                      return item + " ";
                                  })
                                )
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

                <div className="container">
                  <LocationMap />

                </div>
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


export default withMetaData(Home);
