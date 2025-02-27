import React from 'react'
import Marquee from 'react-fast-marquee'

const bannerContent = require("../../data/BannerContent.json");

const Banner = ({ props, textColor, bgLine }) => {

    return (
        <>
            <div className={`banner-top ${props}`}>
                <Marquee>

                    {
                        bannerContent.flatMap((item, index) => {
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