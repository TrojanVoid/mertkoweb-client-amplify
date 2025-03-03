import React, { useEffect, useState } from 'react'
import Marquee from 'react-fast-marquee'

const {requestByType, types} = require('../../apis/BannerApi');

const Banner = ({ props, textColor, bgLine }) => {

    const [bannerData, setBannerData] = useState([]);

    const fetchBannerData = async () => {
        try {
            const response = await requestByType(types.getBanner);
            setBannerData(response.data);
        } catch (err) {
            console.error("Banner data fetch error:", err);
        }
    }


    useEffect(() => {
        fetchBannerData();
    }, []);

    return (
        <>
            <div className={`banner-top ${props}`}>
                <Marquee>

                    {
                        bannerData?.flatMap((item, index) => {
                            return [
                                <div key={index} className={`text-button-uppercase px-8 ${textColor}`}>{item}</div>, 
                                <div key={index} className={`line w-8 h-px ${bgLine}`}></div>
                            ]
                        })
                    }

                </Marquee>
            </div>
        </>
    )
}

export default Banner