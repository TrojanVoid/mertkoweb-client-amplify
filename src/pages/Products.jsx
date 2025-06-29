
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as Icon from "@phosphor-icons/react/dist/ssr";
/* import { ProductType } from '@/type/ProductType' */
import Product from '../components/Product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../util/HandlePagination';
import Layout from '../global/Layout';
import '../style/pages/products.scss';
import withMetaData from '../providers/MetaDataProvider';

const {Logger, TITLE_TAGS} = require('../util/Logger');
const {types, requestByType} = require("../apis/ProductApi");
const productCategoriesData = require("../data/ProductCategories.json")["productCategories"];

const convertShortKeyToCategory = (shortKey) => {
    return productCategoriesData.find(entry => entry["shortKey"] === shortKey)["key"];
}

const sortBy = {
  VOLUME: 'volume',
  DATE: 'date',
}

const sortOrder = {
  ASC: 'asc',
  DESC: 'desc',
}

const urlParamToCategory = {
  '': '',
  'plastik-siseler': 'PlasticBottles',
  'plastik-kavanozlar': 'PlasticJars',
  'konsept-urunler': 'ConceptProducts',
}

const productPerPage = 12;


const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [lastSortQuery, setLastSortQuery] = useState('');

    const [category, setCategory] = useState('');
    const [maxVolume, setMaxVolume] = useState(99999);
    const [volumeRange, setVolumeRange] = useState([0, maxVolume]);
    
    const [layoutCol, setLayoutCol] = useState(4)
    const [openSidebar, setOpenSidebar] = useState(false)

    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;
    
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get('category');

    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await requestByType(types.allProducts);
            const products = response.data.sort((a, b) => {
                if(a.order === null && b.order === null) return 0;
                if(a.order === null) return 1; // null values go to the end
                if(b.order === null) return -1; // null values go to the end
                return a.order - b.order; // sort by order
            });
            if(!products){
              Logger.error(`Error fetching products`, TITLE_TAGS.UI_COMPONENT);
              navigate('/');
            }
            const activeProducts = products.filter(product => product.isActive);
            setProducts(activeProducts);
            setFilteredProducts(activeProducts);
            setPageCount(Math.ceil(activeProducts.length / productsPerPage));
            setCurrentProducts(activeProducts.slice(offset, offset + productsPerPage));

            const maxVolumeInProducts = Math.max(...activeProducts.map(product => product.volume));
            setVolumeRange([0, maxVolumeInProducts]);
            setMaxVolume(maxVolumeInProducts);
        } catch (error) {
            Logger.error(`Error fetching products: ${error}`, TITLE_TAGS.UI_COMPONENT);
        }
    }

    useEffect(() => {
        fetchProducts();
        setCategory(urlParamToCategory[categoryParam || '']);
    }, []);

    useEffect(() => {
      applyFiltersAndSorting(); 
    }, [category, volumeRange, currentPage]);

    useEffect(() => {
      const categoryParam = searchParams.get('category');
      setCategory(urlParamToCategory[categoryParam || '']);
    }, [searchParams]);

    const handleLayoutCol = (col) => {
        setLayoutCol(col);
        
    }

    const applyFiltersAndSorting = (sortQuery = '') => {
      let filteredData = products.filter(product => {
        const isCategoryMatched = category === '' || convertShortKeyToCategory(product.category) === category;
        const isVolumeMatched = product.volume >= volumeRange[0] && product.volume <= volumeRange[1];
        return isCategoryMatched && isVolumeMatched;
      });
    
      console.log('Filtered Products:', filteredData);
    
      const sortToApply = sortQuery || lastSortQuery;
      console.log("sort query: ", sortToApply); 
    
      if (sortToApply && sortToApply !== '') {
        const [sortByValue, sortOrderValue] = sortToApply.split('|');

        filteredData = filteredData.sort((a, b) => {

          if (sortByValue === sortBy.VOLUME) {
            return sortOrderValue === sortOrder.ASC 
              ? a.volume - b.volume 
              : b.volume - a.volume;
          } else if (sortByValue === sortBy.DATE) {
            console.log("a.createdAt: ", a.createdAt);
            console.log("b.createdAt: ", b.createdAt);
            return sortOrderValue === sortOrder.ASC 
              ? new Date(a.createdAt) - new Date(b.createdAt) 
              : new Date(b.createdAt) - new Date(a.createdAt);
          }

          return 0;
        });
      }
    
      setFilteredProducts(filteredData);
      setCurrentProducts(filteredData.slice(offset, offset + productsPerPage));
      const pageCount = Math.ceil(filteredData.length / productsPerPage);
      setPageCount(pageCount);
      if (pageCount === 0) {
        setCurrentPage(0);
      }
    };

    const handleSortChange = (sortQuery) => {
      setLastSortQuery(sortQuery);
      applyFiltersAndSorting(sortQuery);
    };
    

    const handlePageChange = (selected) => {
        setCurrentPage(selected);
        setCurrentProducts(filteredProducts.slice(selected * productsPerPage, (selected + 1) * productsPerPage));
    };

    const handleClearAll = () => {
        setVolumeRange([0, maxVolume]);
        setCategory('');
        setPageCount(Math.ceil(products.length / productsPerPage));
        setCurrentPage(0);
        setFilteredProducts(products);
        setCurrentProducts(products.slice(offset, offset + productsPerPage));
        
    };

    return (
        <Layout>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="pl-5 lg:!pl-[13rem] relative">
                        <div className="main-content w-full h-full pb-3 flex flex-col items-start justify-start relative pb-2 lg:!pb-1 z-[1]">
                            <div className="text-content">
                                <div className="link flex items-center justify-start gap-1 caption1 mt-3">
                                    <Link to={'/'}>Anasayfa</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>Ürünler</div>
                                </div>
                            </div>
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 pt-2 lg:!pt-1 pb-1 lg:!pb-2 overflow-hidden border-t">
                                {productCategoriesData.map((item, index) => (
                                    <h2
                                        key={index}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${category === item?.key ? 'active' : ''}`}
                                        onClick={() => setCategory(item?.key)}
                                    >
                                        {item?.tr.name}
                                    </h2>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 py-5 pb-10">
                <div className="container">
                    <div className="list-product-block relative">
                        <div className="filter-heading flex flex-wrap max-sm:justify-center max-lg:flex-row-reverse items-center justify-between gap-5 shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-2 px-3 rounded-lg">
                            <div className="left max-lg:hidden flex has-line items-center flex-wrap gap-5">
                                <div className="choose-layout flex items-center gap-2">
                                    <div
                                        className={`item three-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 3 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(3)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                    <div
                                        className={`item four-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 4 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(4)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                    <div
                                        className={`item five-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 5 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(5)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="right flex items-center gap-3">
                                {/* <label htmlFor='select-filter' className="caption1 capitalize">Sırala</label> */}
                                <div className="select-block relative">
                                    <select
                                        id="select-filter"
                                        name="select-filter"
                                        className='caption1 py-2 pl-3 pr-10 md:pr-20 rounded-lg border border-line'
                                        onChange={(e) => { handleSortChange(e.target.value)}}
                                        defaultValue={'Sorting'}
                                    >
                                        <option value="Sorting" disabled>Sıralama</option>
                                        <option value={`${sortBy.VOLUME}|${sortOrder.ASC}`}>Artan Hacime Göre</option>
                                        <option value={`${sortBy.VOLUME}|${sortOrder.DESC}`}>Azalan Hacime Göre</option>
                                        <option value={`${sortBy.DATE}|${sortOrder.ASC}`}>Eskiden Yeniye</option>
                                        <option value={`${sortBy.DATE}|${sortOrder.DESC}`}>Yeniden Eskiye</option>
                                    </select>
                                    <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-col w-full h-full p-2 px-3 shadow-[0_1px_2px_rgba(0,0,0,0.1)] rounded-lg mt-3">

                            <div
                                className="filter-sidebar-btn flex items-center gap-2 mt-3"
                                /* onClick={handleOpenSidebar} */
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 21V14" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4 10V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 21V12" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 8V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 21V16" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 12V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M1 14H7" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 8H15" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17 16H23" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Filtreler</span>
                            </div>

                            <div
                            className={`sidebar style-dropdown flex-wrap grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 md:gap-[30px] sm:gap-6 mt-4 pb-3 ${openSidebar ? 'open' : ''}`}
                            >
                                
                                <div className="filter-type">
                                    <h3 className="heading6">Ürün Kategorileri</h3>
                                    <div className="list-type d-flex flex-row mt-2">
                                        {productCategoriesData.map((item, index) => (
                                            <div
                                                key={index}
                                                className={`item flex items-center mr-4 justify-between cursor-pointer ${category === item.key ? 'active' : ''}`}
                                                onClick={() => setCategory(item.key)}
                                            >
                                                <div className='text-secondary has-line-before hover:text-black capitalize'>{item.tr.name}</div>
                                                <div className='text-secondary2'>
                                                    ({products .filter(product => product.category === item.shortKey).length})
                                                </div>
                                            </div>
                                        ))}
                                    </div>  
                                </div>

                                <div>

                                    <div className="filter-price max-sm:mt-5">
                                        <div className="heading6">Hacim Aralığı</div>
                                        <Slider
                                            range
                                            defaultValue={[0, maxVolume]}
                                            min={0}
                                            max={maxVolume}
                                            onChange={(valueArr) => setVolumeRange(valueArr)}
                                            onChangeComplete={() => applyFiltersAndSorting()}
                                            className='mt-3'
                                        />

                                        
                                        <div className="price-block flex items-center justify-end flex-wrap mt-2">
                                            <div className="min flex items-center gap-1">
                                                <span>{`[ ${volumeRange[0]} mL - ${volumeRange[1]} mL ]`}</span>
                                                
                                            </div>
                                            
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-2 px-3 md:py-5 pb-5 rounded-lg mt-3">
                            <div className="list-filtered flex items-center max-md:justify-center gap-3 mt-5 lg:!mt-1 ">
                                <div className="total-product">
                                <span className='text-secondary md:pl-1'>Filtrelere Uyan </span>    
                                    {filteredProducts.length}
                                    <span className='text-secondary pl-1'>Ürün Bulundu</span>
                                </div>
                                {
                                    (category || volumeRange[1] !== maxVolume) && (
                                        <>

                                            {/* <div className="list flex items-center gap-3">
                                                <div className='w-px h-4 bg-line'></div>
                                                {selectedType && (
                                                    <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setType(null) }}>
                                                        <Icon.X className='cursor-pointer' />
                                                        <span>{selectedType}</span>
                                                    </div>
                                                )}
                                                {selectedSize && (
                                                    <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setSize(null) }}>
                                                        <Icon.X className='cursor-pointer' />
                                                        <span>{selectedSize}</span>
                                                    </div>
                                                )}
                                                {selectedColor && (
                                                    <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setColor(null) }}>
                                                        <Icon.X className='cursor-pointer' />
                                                        <span>{selectedColor}</span>
                                                    </div>
                                                )}
                                                {selectedBrand && (
                                                    <div className="item flex items-center px-2 py-1 gap-1 bg-linear rounded-full capitalize" onClick={() => { setBrand(null) }}>
                                                        <Icon.X className='cursor-pointer' />
                                                        <span>{selectedBrand}</span>
                                                    </div>
                                                )}
                                            </div> */}

                                            <div
                                                className="clear-btn flex items-center px-2 py-1 gap-1 rounded-full border border-red cursor-pointer"
                                                onClick={handleClearAll}
                                            >
                                                <Icon.X color='rgb(219, 68, 68)' className='cursor-pointer' />
                                                <span className='text-button-uppercase text-red'>Seçimi Temizle</span>
                                            </div>
                                        </>
                                    )
                                
                                }
                            </div>

                            <div className={`list-product hide-product-sold grid lg:grid-cols-${layoutCol} md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-[30px] gap-[20px] mt-3`}>
                                {currentProducts.length === 0 ? (
                                    <div className="no-data-product">Seçim kriterlerine uyan hiçbir ürün bulunamadı.</div>
                                ) : (
                                    
                                    currentProducts.map((item) => (
                                        <div className="max-md:my-3 max-sm:bg-white-100 rounded-xl max-sm:px-3 max-sm:py-4 max-sm:shadow-sm max-sm:hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 md:hover:-translate-y-[0.4rem] hover:scale-[1.005] md:hover:scale-[1.02] will-change-transform">
                                            <Product key={item.id} data={item} type='grid' font="text-2xl md:text-2xl"/>
                                        </div>
                                    ))
                                )}
                            </div>

                            {pageCount > 1 && (
                                <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                        

                        
                    </div>
                </div>
            </div>
        </Layout>
    )
}

Products.dislayName = "products";
export default withMetaData(Products);