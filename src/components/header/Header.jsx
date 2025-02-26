import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import "../../style/components/Header.scss";
import Banner from './Banner';
import HeaderSlider from './HeaderSlider';
import Menu from './Menu';
/* import GlobalProvider from '@/app/GlobalProvider';
 */



const Header = ({ props }) => {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [isOpenCurrence, setIsOpenCurrence] = useState(false)
    const [language, setLanguage] = useState('Türkçe')
    const [currence, setCurrence] = useState('USD')

    return (
        <>
            <div className={`top-nav md:h-[44px] h-[30px] border-b border-line ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="top-nav-main flex justify-between max-md:justify-center h-full">
                        <div className="left-content flex items-center">
                            <ul className='flex items-center gap-5'>
                                <li>
                                    <Link to={'/hakkimizda'} className='caption2 hover:underline'>
                                        Hakkımızda
                                    </Link>
                                </li>
                                <li>
                                    <Link to={'/iletisim'} className='caption2 hover:underline'>
                                        İletişim
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="right-content flex items-center gap-5 max-md:hidden">
                            <div
                                className="choose-type choose-language flex items-center gap-1.5"
                                onClick={() => {
                                    setIsOpenLanguage(!isOpenLanguage)
                                    setIsOpenCurrence(false)
                                }}
                            >
                                <div className="select relative">
                                    <p className="selected caption2">{language}</p>
                                    <ul className={`list-option bg-white ${isOpenLanguage ? 'open' : ''}`}>
                                        {
                                            ['Türkçe', 'English'].map((item, index) => (
                                                <li key={index} className="caption2" onClick={() => setLanguage(item)}>{item}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <Icon.CaretDown size={12} />
                            </div>
                            {
                            /* <div
                                className="choose-type choose-currency flex items-center gap-1.5"
                                onClick={() => {
                                    setIsOpenCurrence(!isOpenCurrence)
                                    setIsOpenLanguage(false)
                                }}
                            >
                                <div className="select relative">
                                    <p className="selected caption2">{currence}</p>
                                    <ul className={`list-option bg-white ${isOpenCurrence ? 'open' : ''}`}>
                                        {
                                            ['USD', 'EUR', 'GBP'].map((item, index) => (
                                                <li key={index} className="caption2" onClick={() => setCurrence(item)}>{item}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <Icon.CaretDown size={12} />
                            </div> */
                            }
                            <Link to={'https://www.instagram.com/mertkoplastik/'} target='_blank'>
                                <i className="icon-instagram text-black"></i>
                            </Link>
                            {/* <Link to={'https://www.facebook.com/'} target='_blank'>
                                <i className="icon-facebook text-black"></i>
                            </Link>
                            
                            <Link to={'https://www.youtube.com/'} target='_blank'>
                                <i className="icon-youtube text-black"></i>
                            </Link>
                            <Link to={'https://twitter.com/'} target='_blank'>
                                <i className="icon-twitter text-black"></i>
                            </Link>
                            <Link to={'https://pinterest.com/'} target='_blank'>
                                <i className="icon-pinterest text-black"></i>
                            </Link> */}
                        </div>

                    </div>
                </div>
            </div>

            <div id="header" className='relative w-full'>
                
                {/* <GlobalProvider> */}
                    <Menu props="some value" />  
                {/* </GlobalProvider> */}
                
                <Banner props="bg-red py-3" textColor='text-white' bgLine='bg-white' />
                {/* <HeaderSlider /> */}
            </div>
        </>
    )
}

export default Header
