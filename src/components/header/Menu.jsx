import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react";
//import Product from '../../Product/Product';

//import productData from '@/data/Product.json';
//import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from './hooks/useMenuMobile';
//import { useModalCartContext } from '@/context/ModalCartContext';
//import { useModalWishlistContext } from '@/context/ModalWishlistContext';
//import { useModalSearchContext } from '@/context/ModalSearchContext';
//import { useCart } from '@/context/CartContext';


const Menu = ({ props }) => {
    const pathname = window.location.pathname;
    const { openMenuMobile, handleMenuMobile } = useMenuMobile();
    const [openSubNavMobile, setOpenSubNavMobile] = useState(null);
    //const { openModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = (value) => {
        navigate(`/search-result?query=${value}`)
        setSearchKeyword('')
    }

    const handleOpenSubNavMobile = (index) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index)
    }

    const [fixedHeader, setFixedHeader] = useState(false)
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollPosition]);

    const handleGenderClick = (gender) => {
        navigate(`/shop/breadcrumb1?gender=${gender}`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/shop/breadcrumb1?category=${category}`);
    };

    const handleTypeClick = (type) => {
        navigate(`/shop/breadcrumb1?type=${type}`);
    };

    
  

    return (
        <>
            <div className={`header-menu style-one ${fixedHeader ? ' fixed' : 'relative'} w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex items-center justify-start h-full">
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <i className="icon-category text-2xl"></i>
                        </div>
                        <Link to={'/'} className='flex items-center absolute left-1/2 transform -translate-x-1/2 lg:hidden'>
                            <h1 className="heading4">Mertko</h1>
                        </Link>
                       {/*  <div className="form-search relative max-lg:hidden z-[1]">
                            <Icon.MagnifyingGlass
                                size={16}
                                className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer'
                                onClick={() => {
                                    handleSearch(searchKeyword)
                                }}
                            />
                            <input
                                type="text"
                                placeholder='What are you looking for?'
                                className=' h-10 rounded-lg border border-line caption2 w-full pl-9 pr-4'
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                            />
                        </div> */}
                        <div className="menu-main h-full xl:w-full flex items-center absolute left-1/2 transform -translate-x-1/2 justify-center max-lg:hidden ">
                            <ul className='flex items-center gap-8 h-full'>
                                <li className='h-full'>
                                    <Link to="/urunler" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        ÜRÜNLER
                                    </Link>
                                    <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                                        <div className="container">
                                            <div className="flex justify-center py-8">
                                                <div className="nav-link basis-2/3 flex justify-between ">
                                                    <div className="nav-item">
                                                        <Link
                                                                to={'/urunler?category=plastik-siseler'}
                                                                className={`link text-secondary duration-300 ${pathname === '/urunler?category=plastik-siseler' ? 'active' : ''}`}
                                                            >
                                                            <h3 className="text-button-uppercase pb-2">
                                                                Plastik Şişeler
                                                            </h3>
                                                        </Link>
                                                        

                                                        {/* DISABLED SUBCATEGORY LINKS */}
                                                        {/* <ul>
                                                            <li>
                                                                <Link
                                                                    to={'/shop/breadcrumb-img'}
                                                                    className={`link text-secondary duration-300 ${pathname === '/shop/breadcrumb-img' ? 'active' : ''}`}
                                                                >
                                                                    Shop Breadcrumb IMG
                                                                </Link>
                                                            </li>
                                                        </ul> */}

                                                    </div>

                                                    <div className="nav-item">
                                                        <Link
                                                                to={'/urunler?category=plastik-kavanozlar'}
                                                                className={`link text-secondary duration-300 ${pathname === '/urunler?category=plastik-siseler' ? 'active' : ''}`}
                                                            >
                                                            <h3 className="text-button-uppercase pb-2">
                                                                Plastik Kavanozlar
                                                            </h3>
                                                        </Link>
                                                        
                                                    </div>
                                                    
                                                    <div className="nav-item">
                                                        <Link
                                                                to={'/urunler?category=konsept-urunler'}
                                                                className={`link text-secondary duration-300 ${pathname === '/urunler?category=konsept-urunler' ? 'active' : ''}`}
                                                            >
                                                            <h3 className="text-button-uppercase pb-2">
                                                                Konsept Ürünler
                                                            </h3>
                                                        </Link>
                                   
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>

                                </li>

                                <li className='h-full'>
                                    <Link to="/iletisim" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        İLETİŞİM
                                    </Link>
                                </li>
                                <li className='h-full flex items-center justify-center logo'>
                                    <Link to={'/'} className='heading4'>
                                        Mertko
                                    </Link>
                                </li>
                                <li className='h-full'>
                                    <Link to="/hakkimizda" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        HAKKIMIZDA
                                    </Link>

                                    {/* <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                                        <div className="container">
                                            <div className="flex justify-between py-8">
                                                <div className="nav-link basis-2/3 flex justify-between xl:pr-14 pr-5">
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-2">Products Features</div>
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    to={'/product/default'}
                                                                    className={`text-secondary duration-300 ${pathname === '/product/default' ? 'active' : ''}`}
                                                                >
                                                                    Products Defaults
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-2">Products Features</div>
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    to={'/product/external'}
                                                                    className={`text-secondary duration-300 ${pathname === '/product/external' ? 'active' : ''}`}
                                                                >
                                                                    Products External
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-2">Products Layout</div>
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    to={'/product/thumbnail-left'}
                                                                    className={`link text-secondary duration-300 cursor-pointer ${pathname === '/product/thumbnail-left' ? 'active' : ''}`}
                                                                >
                                                                    Products Thumbnails Left
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="recent-product pl-2.5 basis-1/3">
                                                    <div className="text-button-uppercase pb-2">Recent Products</div>
                                                    <div className="list-product hide-product-sold  grid grid-cols-2 gap-5 mt-3">
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

                                </li>
                                <li className='h-full relative'>
                                    <Link to="/bloglar" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="right flex gap-12 z-[1]">
                            <div className="list-action flex items-center gap-4">
                               
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : 'closed'}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={handleMenuMobile}
                                >
                                    <Icon.X size={14} />
                                </div>
                                <Link to={'/'} className='logo text-3xl font-semibold text-center'>
                                    <h1>Mertko</h1>
                                </Link>
                            </div>
                            {/* <div className="form-search relative mt-2">
                                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                                <input type="text" placeholder='What are you looking for?' className=' h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4' />
                            </div> */}
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 2 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(2)}
                                    >
                                        <a href={'#!'} className='text-xl font-semibold flex items-center justify-between mt-5'>
                                            
                                            <h2>Ürünler</h2>
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(2)}
                                            >
                                                <Icon.CaretLeft />
                                                <span className="text-lg font-bold">Geri</span>
                                            </div>
                                            <div className="list-nav-item flex flex-col gap-4 text-lg w-full pt-4 pb-[15rem] pl-[2rem]">
                                                <Link to="urunler?category=plastik-siseler"  className="hover:underline decoration-[1.5px]">
                                                    Plastik Şişeler
                                                </Link>
                                                <Link to="urunler?category=plastik-kavanozlar"  className="hover:underline decoration-[1.5px]">
                                                    Plastik Kavanozlar
                                                </Link>
                                                <Link to="urunler?category=konsept-urunler" className="hover:underline decoration-[1.5px]" >
                                                    Konsept Ürünler
                                                </Link>

                                                {/* <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-1">For Men</div>
                                                        <ul>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleGenderClick('men')}
                                                                    className={`link text-secondary duration-300 cursor-pointer`}
                                                                >
                                                                    Starting From 50% Off
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleGenderClick('men')}
                                                                    className={`link text-secondary duration-300 view-all-btn`}
                                                                >
                                                                    View All
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-1">Skincare</div>
                                                        <ul>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleTypeClick('face')}
                                                                    className={`link text-secondary duration-300 cursor-pointer`}
                                                                >
                                                                    Faces Skin
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleCategoryClick('cosmetic')}
                                                                    className={`link text-secondary duration-300 view-all-btn`}
                                                                >
                                                                    View All
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-1">Health</div>
                                                        <ul>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleTypeClick('candle')}
                                                                    className={`link text-secondary duration-300 cursor-pointer`}
                                                                >
                                                                    Cented Candle
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleCategoryClick('yoga')}
                                                                    className={`link text-secondary duration-300 view-all-btn`}
                                                                >
                                                                    View All
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-1">For Women</div>
                                                        <ul>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleGenderClick('women')}
                                                                    className={`link text-secondary duration-300 cursor-pointer`}
                                                                >
                                                                    Starting From 60% Off
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleGenderClick('women')}
                                                                    className={`link text-secondary duration-300 view-all-btn`}
                                                                >
                                                                    View All
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-1">For Kid</div>
                                                        <ul>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleTypeClick('bed')}
                                                                    className={`link text-secondary duration-300 cursor-pointer`}
                                                                >
                                                                    Kids Bed
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleCategoryClick('toys-kid')}
                                                                    className={`link text-secondary duration-300 view-all-btn`}
                                                                >
                                                                    View All
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="nav-item">
                                                        <div className="text-button-uppercase pb-1">For Home</div>
                                                        <ul>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleCategoryClick('furniture')}
                                                                    className={`link text-secondary duration-300 cursor-pointer`}
                                                                >
                                                                    Furniture | Decor
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div
                                                                    onClick={() => handleCategoryClick('furniture')}
                                                                    className={`link text-secondary duration-300 view-all-btn`}
                                                                >
                                                                    View All
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div> */}

{/* 
                                                <div className="banner-ads-block grid sm:grid-cols-2 items-center gap-6 pt-6">
                                                    <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden" onClick={() => handleTypeClick('swimwear')}>
                                                        <div className="text-content py-14 pl-8 relative z-[1]">
                                                            <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                            <div className="heading6 mt-2">Dive into Savings <br />on Swimwear</div>
                                                            <div className="body1 mt-3 text-secondary">
                                                                Starting at <span className='text-red'>$59.99</span>
                                                            </div>
                                                        </div>
                                                        <img
                                                            src={'/images/slider/bg2-2.png'}
                                                            width={200}
                                                            height={100}
                                                            alt='bg-img'
                                                            className='basis-1/3 absolute right-0 top-0'
                                                        />
                                                    </div>
                                                    <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden" onClick={() => handleTypeClick('accessories')}>
                                                        <div className="text-content py-14 pl-8 relative z-[1]">
                                                            <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                            <div className="heading6 mt-2">20% off <br />accessories</div>
                                                            <div className="body1 mt-3 text-secondary">
                                                                Starting at <span className='text-red'>$59.99</span>
                                                            </div>
                                                        </div>
                                                        <img
                                                            src={'/images/other/bg-feature.png'}
                                                            width={200}
                                                            height={100}
                                                            alt='bg-img'
                                                            className='basis-1/3 absolute right-0 top-0'
                                                        />
                                                    </div>
                                                </div> */}

                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        /* className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(3)} */
                                    >
                                        <a href={'/iletisim'} className='text-xl font-semibold flex items-center justify-between mt-5'>
                                            <h2>İletişim</h2>
                                            {/* <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span> */}
                                        </a>
                                        
                                    </li>
                                    <li
                                        /* className={`${openSubNavMobile === 4 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(4)} */
                                    >
                                        <a href={'/hakkimizda'} className='text-xl font-semibold flex items-center justify-between mt-5'>
                                            <h2>Hakkımızda</h2>
                                            {/* <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span> */}
                                        </a>
                                    </li>
                                    <li
                                        /* className={`${openSubNavMobile === 5 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(5)} */
                                    >
                                        <a href={'/bloglar'} className='text-xl font-semibold flex items-center justify-between mt-5'>
                                            <h2>Blog</h2>
                                            {/* <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span> */}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu