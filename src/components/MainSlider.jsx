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
          setImages(sortCarouselEntitiesByDisplayIndex(response.data));
        }
      } catch (error) {
        Logger.error(`Error fetching images: ${error}`, 'Slider');
      }
    };
    fetchImages();
  }, []);

  const sortCarouselEntitiesByDisplayIndex = (carouselEntities) => {
    return carouselEntities.sort((a, b) => a.displayIndex - b.displayIndex);
  };

  return (
    <div className="slider-block style-two sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[65vh] w-full max-md:mt-5">
      <div className="container xl:!px-[5rem] banner-block pt-[10px] sm:pt-[20px] lg:pt-[30px] flex max-lg:flex-wrap gap-y-5 h-full w-full">
        <div className="slider-main lg:w-full w-full md:px-[10px] lg:px-[15px] ">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="w-full h-full relative rounded-3xl overflow-hidden "
            autoplay={{ delay: 4000 }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="slider-item h-full w-full flex items-center justify-center bg-linear relative">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fluid
                    className="w-full h-full object-cover"
                  />
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
