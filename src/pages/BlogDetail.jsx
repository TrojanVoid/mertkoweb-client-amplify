

import React, { useEffect, useRef, useState } from 'react'
/* import NewsInsight from '@/components/Home3/NewsInsight'; */
import Layout from '../global/Layout';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const {types, requestByType} = require("../apis/BlogApi");
const {Logger, TITLE_TAGS} = require("../util/Logger");

const BlogDetail = () => {
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(null);
    const imageIndexRef = useRef(0);

    const [searchParams] = useSearchParams();
    let blogId;

    try{
      blogId = parseInt(searchParams.get('id'));
      if(!blogId){
        Logger.warn(`Invalid blog id: ${blogId}`, TITLE_TAGS.BLOG_API);
        navigate('/blogs'); 
      }
    }
    catch(e){
      navigate('/blogs');
    }


    const fetchBlogData = async () => {
        try {

            const response = await requestByType(types.getBlog, blogId);
            setBlogData(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            return [];
        }
    }

    useEffect(() => {
        fetchBlogData();
    }, [blogId]);

    const handleBlogClick = (category) => {
        // Go to blog detail with category selected
        navigate(`/blog/default?category=${category}`);
    };

    const handleBlogDetail = (id) => {
        // Go to blog detail with id selected
        navigate(`/blog/detail?id=${id}`);
    };

    return (
        <Layout>
            
            <div className='blog detail1'>
                <div className="bg-img md:mt-[74px] mt-14">
                    <img
                        src={blogData?.images[0]?.imageUrl}
                        width={5000}
                        height={4000}
                        alt={blogData?.images[0]?.altDescription}
                        className='w-full min-[1600px]:h-[800px] xl:h-[640px] lg:h-[520px] sm:h-[380px] h-[260px] object-cover'
                    />
                </div>
                <div className="container md:pt-20 pt-10">
                    <div className="blog-content flex items-center justify-center">
                        <div className="main md:w-5/6 w-full">

                            {/* DISABLED TAG DISPLAY */}
                            {/* <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">{blogData?.tag}</div> */}


                            <div className="heading3 mt-3">{blogData?.title}</div>
                            <div className="author flex items-center gap-4 mt-4">

                                {/* DISABLED AUTHOR AVATAR IMAGE */}

                                {/* <div className="avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={blogData?.avatar}
                                        width={200}
                                        height={200}
                                        alt='avatar'
                                        className='w-full h-full object-cover'
                                    />
                                </div> */}


                                <div className='flex items-center gap-2'>
                                    <div className="caption1 text-secondary">by {blogData?.author}</div>
                                    <div className="line w-5 h-px bg-secondary"></div>
                                    <div className="caption1 text-secondary">{blogData?.createdAt}</div>
                                </div>
                            </div>
                            <div className="content md:mt-8 mt-5">
                                <div className="body1">{blogData?.description}</div>

                                {blogData?.content?.split(' ').map((item, index) => {
                                    if(item === "<br>" || item === "<br/>" || item === "<br />" || item == "</br>")
                                      return <br key={index}/>
                                    if(item ==="<img>" || item === "</img>" || item === "<img/>"){
                                      imageIndexRef.current++;
                                      return <img
                                        key={index}
                                        src={blogData?.images[imageIndexRef.current]?.imageUrl}
                                        width={3000}
                                        height={2000}
                                        alt={blogData?.images[imageIndexRef.current]?.altDescription}
                                        className='w-full rounded-3xl'
                                      ></img>
                                    }

                                    return item + " ";
                                    }
                                  )
                                }

                                {/* <div className="body1 mt-3">I’ve always been passionate about underwear and shapewear and have a huge collection from over the years! 
                                When it came to shapewear, I could never find exactly what I was looking for and I would cut up pieces and sew them together 
                                to create the style and compression I needed.</div> */}
                                
                                
                                {/* <div className="grid sm:grid-cols-2 gap-[30px] md:mt-8 mt-5">
                                    {blogData?.images?.slice(1, blogData?.images.length).map((item, index) => (
                                        <img
                                            key={index}
                                            src={item.imageUrl}
                                            width={3000}
                                            height={2000}
                                            alt={item.altDescription}
                                            className='w-full rounded-3xl'
                                        />
                                    ))}
                                </div> */}


                                {/* 
                                <div className="heading4 md:mt-8 mt-5">How did SKIMS start?</div>
                                <div className="body1 mt-4">This is such a hard question! Honestly, every time we drop a new collection I get obsessed with it. The pieces that have been my go-tos though are some of our simplest styles that we launched with. I wear our Fits Everybody Thong every single day – it is the only underwear I have now, it’s so comfortable and stretchy and light enough that you can wear anything over it.</div>
                                <div className="body1 mt-4">For bras, I love our Cotton Jersey Scoop Bralette – it’s lined with this amazing power mesh so you get great support and is so comfy I can sleep in it. I also love our Seamless Sculpt Bodysuit – it’s the perfect all in one sculpting, shaping and smoothing shapewear piece with different levels of support woven throughout.</div>
                                */}

                            </div>
                            <div className="action flex items-center justify-between flex-wrap gap-5 md:mt-8 mt-5">
                                
                                
                                {/* <div className="left flex items-center gap-3 flex-wrap">
                                    <p>Tag:</p>
                                    <div className="list flex items-center gap-3 flex-wrap">
                                        <div
                                            className={`tags bg-surface py-1.5 px-4 rounded-full text-button-uppercase cursor-pointer duration-300 hover:bg-black hover:text-white`}
                                            onClick={() => handleBlogClick('fashion')}
                                        >
                                            fashion
                                        </div>
                                        <div
                                            className={`tags bg-surface py-1.5 px-4 rounded-full text-button-uppercase cursor-pointer duration-300 hover:bg-black hover:text-white`}
                                            onClick={() => handleBlogClick('yoga')}
                                        >
                                            yoga
                                        </div>
                                        <div
                                            className={`tags bg-surface py-1.5 px-4 rounded-full text-button-uppercase cursor-pointer duration-300 hover:bg-black hover:text-white`}
                                            onClick={() => handleBlogClick('organic')}
                                        >
                                            organic
                                        </div>
                                    </div>
                                </div> */}


                                <div className="right flex items-center gap-3 flex-wrap">
                                    <p>Share:</p>
                                    <div className="list flex items-center gap-3 flex-wrap">
                                        <Link href={'https://www.facebook.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-facebook duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.instagram.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-instagram duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.twitter.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-twitter duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.youtube.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-youtube duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.pinterest.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-pinterest duration-100"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="next-pre flex items-center justify-between md:mt-8 mt-5 py-6 border-y border-line">
                                {blogId === 1 ? (
                                    <>
                                        <div className="left cursor-pointer"
                                            onClick={() => handleBlogDetail(blogData ? blogData.length : 1)}
                                        >
                                            <div className="text-button-uppercase text-secondary2">Previous</div>
                                            <div className="text-title mt-2">{blogData[Math.max(blogData?.length - 1, 0)].title}</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="left cursor-pointer"
                                            onClick={() => handleBlogDetail(blogData[Math.max(blogId - 2, 0)].id)}
                                        >
                                            <div className="text-button-uppercase text-secondary2">Previous</div>
                                            <div className="text-title mt-2">{blogData[Math.max(blogId - 2, 0)].title}</div>
                                        </div>
                                    </>
                                )}
                                {blogId === blogData?.length ? (
                                    <>
                                        <div className="right text-right cursor-pointer"
                                            onClick={() => handleBlogDetail('1')}
                                        >
                                            <div className="text-button-uppercase text-secondary2">Next</div>
                                            <div className="text-title mt-2">{blogData[0].title}</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="right text-right cursor-pointer"
                                            onClick={() => handleBlogDetail(blogData[blogId].id)}
                                        >
                                            <div className="text-button-uppercase text-secondary2">Next</div>
                                            <div className="text-title mt-2">{blogData[Math.max(blogId, 0)].title}</div>
                                        </div>
                                    </>
                                )}

                            </div> */}
                        </div>
                    </div>
                </div>
                <div className='md:pb-20 pb-10'>
                    {/* <NewsInsight data={blogData? }start={0} limit={3} /> */}
                </div>
            </div>

        </Layout>
    )
}

export default BlogDetail