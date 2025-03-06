import React from 'react';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
import "../style/components/Footer.scss";

const Footer = () => {
    return (
        <div id="footer" className='footer'>
            <div className="footer-main bg-surface">
                <div className="container">
                    <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                        <div className="company-infor basis-2/5 max-lg:basis-full">
                            <Link to={'/'} className="logo">
                                <div className="heading4">Mertko</div>
                            </Link>
                            <div className='flex gap-3 mt-3 w-100'>
                                <address className="flex flex-col basis-1/4 sm:basis-[10%] lg:basis-[27%] xl:basis-[20%]">
                                    <span className="text-button">E-Posta:</span>
                                    <span className="text-button mt-3">Tel:</span>
                                    <span className="text-button mt-3">Adres:</span>
                                </address>
                                <address className="flex flex-col ">
                                    <a href="mailto:mertko@mertko.com">
                                      <span className=''>mertko@mertko.com</span>
                                    </a>
                                    <a href="tel:+90 212 223 05 01"  className='mt-3'>
                                      <span>+90 212 223 0501</span>
                                    </a>
                                    <span className='mt-3 pt-px'>Gümüşsuyu Caddesi Ceyhan İş Merkezi No:17 / 42 Topkapı-Maltepe İstanbul</span>
                                </address>
                            </div>
                        </div>
                        <div className="right-content flex flex-wrap gap-y-8 basis-3/5 max-lg:basis-full">
                            <div className="list-nav flex justify-start basis-2/3 lg:justify-end max-md:basis-full gap-4">
                                <div className="item flex flex-col basis-1/3 md:basis-1/3">
                                    <div className="text-button-uppercase pb-3">BİLGİ</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' to={'/iletisim'}>İletişim</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/hakkimizda'}>Hakkımızda</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/sss'}>SSS</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/bloglar'}>Blog</Link>
                                    {/* <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'#!'}>Career</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/order-tracking'}>Order  & Returns</Link> */}
                                    
                                </div>
                                <div className="item flex flex-col basis-1/3  md:basis-1/3">
                                    <div className="text-button-uppercase pb-3">Ürünler</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' to={'/urunler?category=plastik-siseler'}>Plastik Şişeler</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/urunler?category=plastik-kavanozlar'}>Plastik Kavanozlar</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/urunler?category=konsept-urunler'}>Konsept Ürünler</Link>
                                    
                                </div>
                                {/* <div className="item flex flex-col basis-1/3 ">
                                    <div className="text-button-uppercase pb-3">Customer Services</div>
                                    <Link className='caption1 has-line-before duration-300 w-fit' to={'/pages/faqs'}>Orders FAQs</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/pages/faqs'}>Shipping</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/pages/faqs'}>Privacy Policy</Link>
                                    <Link className='caption1 has-line-before duration-300 w-fit pt-2' to={'/order-tracking'}>Return & Refund</Link>
                                </div> */}
                            </div>
                            <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                                <div className="text-button-uppercase">Bülten</div>
                                <div className="caption1 mt-3">Bültenimize kaydolmak ister misiniz?</div>
                                <div className="input-block w-full h-[52px] mt-4">
                                    <form className='w-full h-full relative' action="post">
                                        <input type="email" placeholder='E-posta adresinizi giriniz' className='caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line' required />
                                        <button className='w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1'>
                                            <Icon.ArrowRight size={24} color='#fff' />
                                        </button>
                                    </form>
                                </div>
                                <div className="list-social flex items-center gap-6 mt-4">
                                    <Link to={'https://www.instagram.com/mertkoplastik/'} target='_blank'>
                                        <div className="icon-instagram text-2xl text-black"></div>
                                    </Link>
                                    {/* <Link to={'https://www.facebook.com/'} target='_blank'>
                                        <div className="icon-facebook text-2xl text-black"></div>
                                    </Link>
                                    
                                    <Link to={'https://www.twitter.com/'} target='_blank'>
                                        <div className="icon-twitter text-2xl text-black"></div>
                                    </Link>
                                    <Link to={'https://www.youtube.com/'} target='_blank'>
                                        <div className="icon-youtube text-2xl text-black"></div>
                                    </Link>
                                    <Link to={'https://www.pinterest.com/'} target='_blank'>
                                        <div className="icon-pinterest text-2xl text-black"></div>
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                        <div className="left flex items-center gap-8">
                            <div className="copyright caption1 text-secondary">©2025 Mertko. Tüm hakları saklıdır.</div>
                            <div className="select-block flex items-center gap-5 max-md:hidden">
                                <div className="choose-language flex items-center gap-1.5">
                                    <select name="language" id="chooseLanguageFooter" className='caption2 bg-transparent'>
                                        <option value="Turkish">Türkçe</option>
                                        <option value="English">English</option>
                                        {/* <option value="Espana">Espana</option>
                                        <option value="France">France</option> */}
                                    </select>
                                    <Icon.CaretDown size={12} color='#1F1F1F' />
                                </div>
                                <div className="choose-currency flex items-center gap-1.5">
                                    {/* <select name="currency" id="chooseCurrencyFooter" className='caption2 bg-transparent'>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                    <Icon.CaretDown size={12} color='#1F1F1F' /> */}
                                </div>
                            </div>
                        </div>
                        <div className="right flex items-center gap-2">
                            {/* <div className="caption1 text-secondary">Payment:</div>
                            <div className="payment-img">
                                <img
                                    src='/images/payment/Frame-0.png'
                                    alt='payment'
                                    className='w-9'
                                />
                            </div>
                            <div className="payment-img">
                                <img
                                    src='/images/payment/Frame-1.png'
                                    alt='payment'
                                    className='w-9'
                                />
                            </div>
                            <div className="payment-img">
                                <img
                                    src='/images/payment/Frame-2.png'
                                    alt='payment'
                                    className='w-9'
                                />
                            </div>
                            <div className="payment-img">
                                <img
                                    src='/images/payment/Frame-3.png'
                                    alt='payment'
                                    className='w-9'
                                />
                            </div>
                            <div className="payment-img">
                                <img
                                    src='/images/payment/Frame-4.png'
                                    alt='payment'
                                    className='w-9'
                                />
                            </div>
                            <div className="payment-img">
                                <img
                                    src='/images/payment/Frame-5.png'
                                    alt='payment'
                                    className='w-9'
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
