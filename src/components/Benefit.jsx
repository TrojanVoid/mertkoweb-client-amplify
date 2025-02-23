import React from 'react'
import '../style/components/benefit.scss'

const Benefit = ({ props=null }) => {
    return (
        <>
            <div className="container py-[4rem]">
                <div className={`benefit-block ${props ? props : ''}`}>
                    <div className="list-benefit grid items-start md:grid-cols-3 grid-cols-1 xl:gap-[160px] lg:gap-20 gap-10 gap-y-6">
                        <div className="benefit-item flex flex-col items-center justify-center">
                            <i className="icon-double-leaves lg:text-7xl text-5xl"></i>
                            <div className="body1 font-semibold uppercase text-center mt-3 md:!mt-5 text-black-1 ">100% ORGANIC</div>
                            <div className="caption1 text-secondary text-center mt-2">We believe in skin that looks like skin and radiance that come naturally</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center pt-3 md:!pt-0">
                            <i className="icon-leaves lg:text-7xl text-5xl"></i>
                            <div className="body1 font-semibold uppercase text-center mt-3 md:!mt-5 text-black-1">NO SYNTHETIC COLORS</div>
                            <div className="caption1 text-secondary text-center mt-3">With transparency ad our guide and color as our vehicle conventions</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center pt-3 md:!pt-0">
                            <i className="icon-rabbit-heart lg:text-7xl text-5xl"></i>
                            <div className="body1 font-semibold uppercase text-center mt-3 md:!mt-5 text-black-1">NO ANIMAL TESTING</div>
                            <div className="caption1 text-secondary text-center mt-3">We challenge the conventions of clean beauty to create.</div>
                        </div>
                    </div> 
                </div>
            </div>
        </>
    )
}

export default Benefit