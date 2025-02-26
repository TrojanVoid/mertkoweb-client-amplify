import React from 'react'
import '../style/components/benefit.scss'

const Benefit = ({ props=null }) => {
    return (
        <>
            <div className="container py-[4rem]">
                <div className={`benefit-block ${props ? props : ''}`}>
                    <div className="list-benefit grid items-start md:grid-cols-3 grid-cols-1 xl:gap-[160px] lg:gap-20 gap-10 gap-y-6">
                        <div className="benefit-item flex flex-col items-center justify-center">
                            {/* <i className="icon-double-leaves lg:text-7xl text-5xl"></i> */}
                            <img src="/resources/images/proprietary-icon.svg" alt="proprietary-icon" className="w-16 h-16" />
                            <div className="body1 font-semibold uppercase text-center mt-3 md:!mt-5 text-black-1 ">TESCİLLİ ÜRÜNLER</div>
                            <div className="caption1 text-secondary text-center mt-2">Ürünlerimizin tamamı tescillidir; bu sayede gönül rahatlığıyla pazarlama yapabilirsiniz</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center pt-3 md:!pt-0">
                            {/* <i className="icon-leaves lg:text-7xl text-5xl"></i> */}
                            <img src="/resources/images/experience-icon.svg" alt="experience-icon" className='w-16 h-16' />
                            <div className="body1 font-semibold uppercase text-center mt-3 md:!mt-5 text-black-1">45 YILI AŞAN DENEYİM</div>
                            <div className="caption1 text-secondary text-center mt-3">1980’den bu yana hizmet veren firmamızda, ürün kalitesi ve müşteri odaklı hizmet anlayışı için doğru adrestesiniz</div>
                        </div>
                        <div className="benefit-item flex flex-col items-center justify-center pt-3 md:!pt-0">
                            <img src="/resources/images/delivery-icon.svg" alt="delivery-icon" className='w-16 h-16' />
                            <div className="body1 font-semibold uppercase text-center mt-3 md:!mt-5 text-black-1">ANLAŞMALI KARGO</div>
                            <div className="caption1 text-secondary text-center mt-3">Geniş ürün yelpazemizle siparişleriniz garantili teslim edilir; Türkiye genelindeki anlaşmalı ambar ve kargo firmalarıyla hizmetinizdeyiz</div>
                        </div>
                    </div> 
                </div>
            </div>
        </>
    )
}

export default Benefit