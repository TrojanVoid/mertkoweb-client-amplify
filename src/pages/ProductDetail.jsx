
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import Benefit from '../components/Benefit';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import 'swiper/css/bundle';

import Layout from '../global/Layout';
import withMetaData from '../providers/MetaDataProvider';
import axios from 'axios';

const {types, requestByType} = require('../apis/ProductApi');
const {types: contactApiTypes, requestByType: contactApiRequestByType} = require('../apis/ContactApi');
const {TITLE_TAGS, Logger} = require('../util/Logger');

const productCategories = require('../data/ProductCategories.json').productCategories;


const ProductDetail = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
    const [searchParams] = useSearchParams();

    const [productCategory, setProductCategory] = useState(null);
    const [description, setDescription] = useState('Henüz bir açıklama yok.');
    const [whatsappMessageTemplate, setWhatsappMessageTemplate] = useState(null);
    const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState(null);

    const fetchProductData = async(id) => {
      const response = await requestByType(types.singleProduct, id);
      const productData = response.data;
      if(!productData){
        Logger.error(`Error fetching product data with id: ${id}`, TITLE_TAGS.UI_COMPONENT);
        navigate('/urunler');
      }
      setData(productData);
      setProductCategory(productData.category);
      console.log(`Product category: ${productData.category}`);
    };

    const fetchProductCategoryDescription = async () => {
      try {
        const response = await requestByType(types.getProductCategories);
        if (response.status === 200 && response?.data) {
          Logger.info(`Product category: ${productCategory} and response: ${response.data}`);
          Logger.info(`Product data: ${data}`);
          setDescription(response.data.find((item) => item.shortKey === productCategory)?.categoryDescription);
        }
        else{
          Logger.error("Error fetching product category meta data", TITLE_TAGS.UI_COMPONENT);
        }
      } catch (error) {
        Logger.error(`Product category meta data fetch error: ${error}`, TITLE_TAGS.UI_COMPONENT);
      }
    };

    const fetchWhatsappData = async() => {
      const response = await contactApiRequestByType(contactApiTypes.getContact);
      if(response?.data){
        setWhatsappPhoneNumber(response.data.whatsappPhoneNumber.replace('+', '').trim());
        setWhatsappMessageTemplate(response.data.whatsappMessageTemplate);
      }
    };
     
    useEffect(() => {
      const productId = searchParams.get('id');
      if(!productId) {
        navigate('/urunler');
      }
      fetchProductData(productId)
      fetchWhatsappData();
    }, []);

    useEffect(() => {
      fetchProductCategoryDescription();
    }, [data, productCategory]);

    const handleDetailProduct = (productId) => {
        navigate(`/urun-detay?id=${productId}`);
    };

    const handleGetProductInfo = () => {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const message = whatsappMessageTemplate.replace('$$PRODUCT_NAME$$', data.name);
      console.log(`Message: ${message}`);
      if (isMobile && navigator.share) {
        const whatsappUrl = `whatsapp://send?phone=${whatsappPhoneNumber}&text=${encodeURIComponent(message)}`;
        window.location.href = whatsappUrl;
      } else {
        // Fallback: redirect to the "iletisim" page with the product data.
        navigate('/iletisim', { state: { messageTemplate: message } });
      }
    };

    const handleSwiper = (swiper) => {
      setThumbsSwiper(swiper);
  };

    if(!data){
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Layout>
            <div className="product-detail product-container h-auto  flex flex-col justify-center items-start md:pt-20 pt-14 px-0 mx-0">
                <div className="container h-auto flex lg:items-start justify-between gap-y-6 flex-wrap px-5">
                    <div className="list-img h-[75vh] md:w-1/2 md:pr-4 w-full">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={0}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[Thumbs]}
                            className="mySwiper2 rounded-2xl overflow-hidden h-100"
                        >
                          {data?.images?.sort((i1, i2) => i1.imageIndex - i2.imageIndex).map((image, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={image.imageUrl}
                                width={1000}
                                height={1000}
                                alt={image.altDescription ? image.altDescription : data.name}
                                className='w-full aspect-[3/4] object-cover h-100'
                              />
                            </SwiperSlide>
                            )
                          )}
                        </Swiper>

                        <Swiper
                            onSwiper={handleSwiper}
                            spaceBetween={0}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[Navigation, Thumbs, FreeMode]}
                            className="mySwiper"
                        >
                          {data.images.map((image, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={image.imageUrl}
                                width={1000}
                                height={1000}
                                alt={image.altDescription ? image.altDescription : data.name}
                                className='w-full aspect-[3/4] object-cover rounded-xl border-white border-1'
                              />
                            </SwiperSlide>
                            )
                          )}
                        </Swiper>
                        
                    </div>
                    <div className="product-infor h-full flex flex-col md:w-1/2 w-full lg:pl-16 md:pl-6">
                        <h1 className="caption2 text-secondary font-semibold uppercase">
                          {
                            productCategories.find(category => category.shortKey === data.category).tr.nameSingle
                          }
                        </h1>
                        <h2 className="heading4 mt-1">{data.name}</h2>

                        <div className="flex items-center gap-3 flex-wrap mt-4">
                            <h3 className="text-size-lg font-semibold">
                              MALZEME:
                            </h3>
                            <span className="text-size-lg text-secondary">
                              {data.material ? data.material : 'Belirtilmemiş'}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3 flex-wrap mt-2 pb-6 border-b border-line">
                            <h3 className="text-size-lg font-semibold">
                              HACİM:
                            </h3>
                            <span className="text-size-lg text-secondary">
                              {data.volume} ML
                            </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap mt-4 pb-6 border-b border-line">
                          <h3 className="text-size-lg font-semibold">
                            AÇIKLAMA
                          </h3>
                          <span className="text-size-lg text-secondary">
                            {data.description ? data.description : description}
                          </span>
                        
                        </div>
                        <div className="list-action mt-auto">
                            
                            <div className="button-block">
                                <div onClick={handleGetProductInfo} className="button-main w-full text-center">FİYAT BİLGİSİ ALIN</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='desc-item description open w-[100%] ml-0 mt-[7rem] bg-surface p-6 pb-[4rem] rounded-t-2xl border-bottom border-line'>
                    <div className='w-100 flex flex-col justify-center items-center text-center'>
                        <h6 className="heading6 pb-3 mt-3">
                          ÜRÜNLERİMİZ HAKKINDA
                        </h6>
                            <div className="list-feature">
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      Dayanıklı, sızdırmaz ve uzun ömürlü plastik şişe ve kavanozlar.
                                    </p>
                                </div>
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      Kozmetik, temizlik ve ilaç sektörleri için tasarlanmış ambalajlar.
                                    </p>
                                </div>
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      Farklı hacim, kapak ve renk alternatifleriyle her ihtiyaca uygun modeller.
                                    </p>
                                </div>
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      Marka kimliğinizi yansıtan tasarım ve baskı seçenekleri.
                                    </p>
                                </div>
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      PET ve PE(Polietilen) hammaddeden üretilmiş, sağlık ve kalite standartlarına uygun ürünler.
                                    </p>
                                </div>
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      Soft touch seçeneği ile şişe üzerinde yumuşak hissiyat.
                                    </p>
                                </div>
                                <div className="item flex gap-1 text-secondary mt-2">
                                    <Icon.Dot size={28} />
                                    <p>
                                      Şişe içi renklendirme ile ürünün orijinalliğini teyitlemek.
                                    </p>
                                </div>
                            </div>

                          <div className='pt-[3rem]'>
                            <Benefit/>
                          </div>
                    </div>
                    
                    

                </div>
            </div>
        
        </Layout>
    )
}

ProductDetail.displayName = 'product-detail';
export default (props) => <ProductDetailWithMeta {...props} />;

const ProductDetailWithMeta = (props) => {
    const [productCategory, setProductCategory] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            const productId = new URLSearchParams(window.location.search).get('id');
            if (!productId) return;
            const response = await requestByType(types.singleProduct, productId);
            if (response?.data?.category) {
                setProductCategory(response.data.category);
            }
        };
        fetchCategory();
    }, []);

    return withMetaData(ProductDetail, productCategory)(props);
};