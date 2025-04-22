import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Product from './Product';
import { motion } from 'framer-motion';
const {Logger, TITLE_TAGS} = require("../util/Logger");
const {types, requestByType} = require("../apis/ProductApi");

const ProductTabTypes = require('../data/ProductTabTypes.json')["productTabTypes"];
const featuredProductTypes = ProductTabTypes.map((entry) => {
    return entry["key"];
});

const ProductTab = ({ data, start, limit }) => {
    const [activeTab, setActiveTab] = useState('featuredProducts');
    const [loading, setLoading] = useState(true);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [newReleaseProducts, setNewReleaseProducts] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('tr');
    
    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            for(const featureType of featuredProductTypes) {
              await requestByType(featureType)
                .then((response) => {
                  if(!response || !response.data || response.data.length === 0) {
                      return;
                  }
                  if (featureType === 'featuredProducts') {
                      setFeaturedProducts(response.data);
                  } else if (featureType === 'bestSellers') {
                      setBestSellerProducts(response.data);
                  } else if (featureType === 'newReleases') {
                      setNewReleaseProducts(response.data);
                  }
                  setLoading(false);
                });
            }
        } catch (error) {
            Logger.error(`Error fetching products: ${error}`, TITLE_TAGS.UI_COMPONENT);
        }
    };

    const handleTabClick = (item) => {
        setActiveTab(item);
    }

    const getSelectedProductList = () => {
      switch (activeTab) {
        case 'bestSellers':
            return bestSellerProducts;
        case 'featuredProducts':
            return featuredProducts;
        case 'newReleases':
            return newReleaseProducts;
        default:
            return featuredProducts;
      }
    }


    return (
        <>
            <div className="tab-features-block md:pt-20 pt-10 w-[90%]">
                <div className="container">
                    <div className="heading flex flex-col items-center text-center">
                        <div className="menu-tab flex flex-shrink justify-center items-center gap-2 p-1 bg-surface rounded-2xl">
                            {['bestSellers', 'featuredProducts', 'newReleases'].map((item, index) => (
                                <div
                                    key={index}
                                    className={`tab-item relative w-25 md:!w-[33%] text-secondary flex items-center justify-center heading5 py-2 px-5 cursor-pointer duration-500 hover:text-black ${activeTab === item ? 'active' : ''}`}
                                    onClick={() => handleTabClick(item)}
                                >
                                    {activeTab === item && (
                                        <motion.div layoutId='active-pill' className='absolute !w-33 inset-0 rounded-2xl bg-white'></motion.div>
                                    )}
                                    <span className='relative text-center text-sm sm:text-base md:text-lg z-[1]'>
                                        {ProductTabTypes.find((entry) => entry["key"] === item)[selectedLanguage]["name"]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="list-product hide-product-sold section-swiper-navigation align md:mt-10 mt-6">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={2}
                            navigation
                            loop={true}
                            modules={[Navigation, Autoplay]}
                            breakpoints={{
                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1200: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                            }}
                        >
                            {!loading && getSelectedProductList().slice(start, limit).map((prd, index) => (
                                <SwiperSlide key={index}>
                                    <Product data={prd} type='grid' className="w-[30%]"/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductTab