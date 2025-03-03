import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icon from "@phosphor-icons/react"
import Marquee from 'react-fast-marquee'
//import Rate from '../Other/Rate'
/* import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCompare } from '@/context/CompareContext'
import { useModalCompareContext } from '@/context/ModalCompareContext'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext' */

const Product = ({ data, type, style }) => {
    const [activeColor, setActiveColor] = useState('')
    const [activeSize, setActiveSize] = useState('')
    const [openQuickShop, setOpenQuickShop] = useState(false)
    /* const { addToCart, updateCart, cartState } = useCart();
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
    const { openModalWishlist } = useModalWishlistContext()
    const { addToCompare, removeFromCompare, compareState } = useCompare();
    const { openModalCompare } = useModalCompareContext()
    const { openQuickview } = useModalQuickviewContext() */
    const navigate = useNavigate();


    /* const handleAddToCart = () => {
        if (!cartState.cartArray.find((item) => item.id === data.id)) {
            addToCart({ ...data });
            updateCart(data.id, data.quantityPurchase, activeSize, activeColor)
        } else {
            updateCart(data.id, data.quantityPurchase, activeSize, activeColor)
        }
        openModalCart()
    }; */

    /* const handleAddToWishlist = () => {
      // if product existed in wishlist, remove from wishlist and set state to false
      if (wishlistState.wishlistArray.some((item) => item.id === data.id)) {
        removeFromWishlist(data.id);
      } else {
        // else, add to wishlist and set state to true
        addToWishlist(data);
      }
      openModalWishlist();
    }; */

    /* const handleAddToCompare = () => {
      // if product existed in compare list, remove from compare list and set state to false
      if (compareState.compareArray.length < 3) {
        if (compareState.compareArray.some((item) => item.id === data.id)) {
          removeFromCompare(data.id);
        } else {
          // else, add to compare list and set state to true
          addToCompare(data);
        }
      } else {
        alert('Compare up to 3 products')
      }

      openModalCompare();
    }; */

    /* const handleQuickviewOpen = () => {
        openQuickview(data)
    } */

    const handleDetailProduct = (productId) => {
        // redirect to shop with category selected
        navigate(`/urun-detay?id=${productId}`);
    };


    return (
        <>
            {type === "grid" ? (
                <div className={`product-item grid-type ${style}`}>
                    <div onClick={() => handleDetailProduct(data.id)} className="product-main cursor-pointer block">
                        <div className="product-thumb bg-white relative overflow-hidden rounded-2xl w-100 h-100">
                            <div className="product-img w-full h-full aspect-[4/3]">
                                {activeColor ? (
                                    <>
                                        {
                                            <img
                                                src={data.variation.find((item) => item.color === activeColor)?.image ?? ''}
                                                width={250}
                                                height={250}
                                                alt={data.name}
                                                //priority={true}
                                                className='w-full h-full object-cover duration-700'
                                            />
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            data.images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img.imageUrl}
                                                    width={250}
                                                    height={250}
                                                    //priority={true}
                                                    alt={img.altDescription ? img.altDescription : data.name}
                                                    className='w-full h-full object-cover duration-700'
                                                />
                                            ))
                                        }
                                    </>
                                )}
                            </div>

                            {/* TODO MAYBE ADD THIS BACK IN ANOTHER FORMAT? */}
                            {/* {data.sale && (
                                <>
                                    <Marquee className='banner-sale-auto bg-black absolute bottom-0 left-0 w-full py-1.5'>
                                        <div className={`caption2 font-semibold uppercase text-white px-2.5`}>Hot Sale {percentSale}% OFF</div>
                                        <Icon.Lightning weight='fill' className='text-red' />
                                        <div className={`caption2 font-semibold uppercase text-white px-2.5`}>Hot Sale {percentSale}% OFF</div>
                                        <Icon.Lightning weight='fill' className='text-red' />
                                        <div className={`caption2 font-semibold uppercase text-white px-2.5`}>Hot Sale {percentSale}% OFF</div>
                                        <Icon.Lightning weight='fill' className='text-red' />
                                        <div className={`caption2 font-semibold uppercase text-white px-2.5`}>Hot Sale {percentSale}% OFF</div>
                                        <Icon.Lightning weight='fill' className='text-red' />
                                        <div className={`caption2 font-semibold uppercase text-white px-2.5`}>Hot Sale {percentSale}% OFF</div>
                                        <Icon.Lightning weight='fill' className='text-red' />
                                    </Marquee>
                                </>
                            )} */}
                            
                            {/* <div className="list-action-icon flex items-center justify-center gap-2 absolute w-full bottom-3 z-[1] lg:hidden">
                                <div
                                    className="quick-view-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        //handleQuickviewOpen()
                                    }}
                                >
                                    <Icon.Eye className='text-lg' />
                                </div>
                                <div
                                    className="add-cart-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
                                    onClick={e => {
                                        e.stopPropagation();
                                        //handleAddToCart()
                                    }}
                                >
                                    <Icon.ShoppingBagOpen className='text-lg' />
                                </div>
                            </div> */}

                        </div>
                        <div className="product-infor mt-4 lg:mb-7">

                            {/* <div className="product-sold sm:pb-4 pb-2">
                                <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden relative">
                                    <div
                                        className={`progress-sold bg-red absolute left-0 top-0 h-full`}
                                        style={{ width: `${percentSold}%` }}
                                    >
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                                    <div className="text-button-uppercase">
                                        <span className='text-secondary2 max-sm:text-xs'>Hacim: </span>
                                        <span className='max-sm:text-xs'>{data.volume}</span>
                                    </div>
                                    <div className="text-button-uppercase">
                                        <span className='text-secondary2 max-sm:text-xs'>Available: </span>
                                        <span className='max-sm:text-xs'>{data.quantity - data.sold}</span>
                                    </div>
                                </div>
                            </div> */}

                            <div className="product-name d-flex justify-between text-title duration-300 text-black-0">
                                <h3 className="text-2xl">
                                    {data.name}
                                </h3>
                                <h4 className="text-2xl">
                                    {data.volume} mL 
                                </h4>
                            </div>
                            {/* {data.variation.length > 0 && data.action === 'add to cart' && (
                                <div className="list-color py-2 max-md:hidden flex items-center gap-2 flex-wrap duration-500">
                                    {data.variation.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`color-item w-6 h-6 rounded-full duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
                                            style={{ backgroundColor: `${item.colorCode}` }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleActiveColor(item.color)
                                            }}>
                                            <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
                                        </div>
                                    ))}
                                </div>
                            )} */}
                            {/* {data.variation.length > 0 && data.action === 'quick shop' && (
                                <div className="list-color-image max-md:hidden flex items-center gap-2 flex-wrap duration-500">
                                    {data.variation.map((item, index) => (
                                        <div
                                            className={`color-item w-8 h-8 rounded-lg duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleActiveColor(item.color)
                                            }}
                                        >
                                            <img
                                                src={item.colorImage}
                                                width={100}
                                                height={100}
                                                alt='color'
                                                //priority={true}
                                                className='w-full h-full object-cover rounded-lg'
                                            />
                                            <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
                                        </div>
                                    ))}
                                </div>
                            )} */}


                            {/* <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
                                <div className="product-price text-title">${data.price}.00</div>
                                {percentSale > 0 && (
                                    <>
                                        <div className="product-origin-price caption1 text-secondary2"><del>${data.originPrice}.00</del></div>
                                        <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
                                            -{percentSale}%
                                        </div>
                                    </>
                                )}
                            </div> */}

                        </div>
                    </div>
                </div>
            ) : (
                <>
                    
                </>
            )
            }
        </>
    )
}

export default Product