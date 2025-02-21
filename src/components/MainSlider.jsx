import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Image } from 'react-bootstrap'; 
import "../style/shared.scss";
const { Logger } = require('../util/Logger');
const { types, requestByType } = require('../apis/ProductApi');

const MainSlider = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await requestByType(types.carouselImages);
                if (response && response.data) {
                    setImages(response.data);
                }
            } catch (error) {
                Logger.error(`Error fetching images: ${error}`, 'Slider');
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="slider-block style-two w-full h-[70vh]">
            <div className="container banner-block lg:pt-[30px] flex max-lg:flex-wrap gap-y-5 h-full w-full">
                <div className="slider-main lg:w-full w-full lg:pr-[15px] max-lg:h-[300px] max-[420px]:h-[340px]">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className='w-full h-full relative rounded-3xl overflow-hidden'
                        autoplay={{ delay: 4000 }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="slider-item h-full w-full flex items-center bg-linear relative">
                                    <div className="text-content relative z-[1] md:pl-[60px] pl-5 basis-1/3">
                                        <div className="text-button-uppercase text-black-0">{image.title} TEST TITLE</div>
                                        <div className="body1 lg:mt-4 mt-3">{image.description}</div>
                                    </div>
                                    <div className="sub-img absolute w-75 right-0 top-0 bottom-0">
                                        <Image
                                            src={image.imageUrl}
                                            width={2000}
                                            height={1936}
                                            alt={image.description}
                                            fluid
                                            className='w-full h-full'
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default MainSlider;
