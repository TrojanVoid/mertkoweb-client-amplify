import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroller from './InfiniteScroller';
import Product from './Product';

const { Logger, TITLE_TAGS } = require("../util/Logger");
const { types, requestByType } = require("../apis/ProductApi");
const ProductTabTypes = require('../data/ProductTabTypes.json')["productTabTypes"];

const featuredProductTypes = ProductTabTypes.map((entry) => entry["key"]);

const ProductTab = ({ start = 0, limit = 12 }) => {
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
      for (const featureType of featuredProductTypes) {
        await requestByType(featureType).then((response) => {
          if (!response || !response.data || response.data.length === 0) return;
          const data = response.data.sort((a, b) => {
            if (a.order === null && b.order === null) return 0;
            if (a.order === null) return 1; // null values go to the end
            if (b.order === null) return -1; // null values go to the end
            return a.order - b.order; // sort by order
          });

          if (featureType === 'featuredProducts') {
            setFeaturedProducts(data);
          } else if (featureType === 'bestSellers') {
            setBestSellerProducts(data);
          } else if (featureType === 'newReleases') {
            setNewReleaseProducts(data);
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
  };

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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader" />
      </div>
    );
  }

  const selectedProducts = getSelectedProductList();

  return (
    <div className="container py-10 w-[90%] mx-auto">
      <div className="heading flex flex-col items-center text-center">
        <div className="menu-tab flex flex-shrink justify-center items-center gap-2 p-2 bg-surface rounded-2xl">
          {['bestSellers', 'featuredProducts', 'newReleases'].map((item, index) => (
            <div
              key={index}
              className={`tab-item relative min-w-[120px] md:min-w-[150px] text-secondary flex items-center justify-center heading5 py-3 px-6 cursor-pointer duration-500 hover:text-black ${activeTab === item ? 'text-black' : ''}`}
              onClick={() => handleTabClick(item)}
            >
              {activeTab === item && (
                <motion.div layoutId="active-pill" className="absolute !w-full inset-0 rounded-2xl bg-white" />
              )}
              <span className="relative text-center text-sm sm:text-base md:text-lg z-[1]">
                {ProductTabTypes.find((entry) => entry["key"] === item)[selectedLanguage]["name"]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <InfiniteScroller
        items={selectedProducts}
        itemsPerLoad={limit}
        deviceItemsPerLoad={{ mobile: 4, tablet: 6, desktop: 8 }}
        promptType="click"
        scrollThreshold={0.8}
        loadMoreButton={
          <button 
            type="button" 
            className="btn bg-cyan-600 text-white text-md tracking-wide font-bold shadow-lg mt-3 px-[5rem] lg:!px-[5rem] mt-3 py-2 lg:!py-3 uppercase 
            hover:bg-cyan-500 hover:!shadow-sm hover:tracking-tight hover:scale-[95%] 
            transition-all duration-300 ease-in-out will-change-transform">
              Daha Fazla
          </button>
        }
      >
        {(itemsToRender) => (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-[3rem]">
            {itemsToRender.map((product, index) => (
              <Product key={product.sku || index} data={product} type="grid" />
            ))}
          </div>
        )}
      </InfiniteScroller>
    </div>
  );
};

export default ProductTab;
