import React from 'react';
//import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
const {types, requestByType} = require('../../apis/ProductApi');

const HeaderSlider = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await requestByType(types.carouselImages);
                console.log('API Response:', response.data);
                if (Array.isArray(response.data)) {
                    setImages(response.data);
                } else {
                    console.error('Response data is not an array:', response.data);
                    setImages([]);
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);


    return (
        <>
            <div className="slider-block style-one bg-linear xl:py-[100px] px-4 md:py-20 py-14 w-full">
                <div className="slider-main h-full w-full flex items-center justify-center gap-10">
                    {images.map((image, index) => (
                    <>
                        <div key={index} className="sub-img  max-md:w-1/2 rounded-b-full overflow-hidden max-md:hidden">
                            <img
                                src={image.imageUrl}
                                alt={image.title}
                                className='w-full'
                            />
                            <div key={index} className="text-content w-fit">
                                <div className="text-display text-center md:mt-4 mt-2">{image.title}test title</div>
                                <div className="text-center">
                                </div>
                            </div>
                        </div>
                            {/* <div className="text-content w-fit">
                                <div className="text-sub-display text-center">Sale! Up To 50% Off!</div>
                                <div className="text-display text-center md:mt-4 mt-2">Transform Your <br />Look This <br />summer</div>
                                <div className="text-center">
                                    <a href='/shop/breadcrumb-img' className="button-main md:mt-8 mt-3">Shop Now</a>
                                </div>
                            </div> */}
                        
                    </>
                    ))}
                    
                </div>
                
            </div>
        </>
    );
};

export default HeaderSlider;
