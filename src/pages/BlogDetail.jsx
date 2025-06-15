

import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

import { useCreateBlockNote } from '@blocknote/react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { FiFeather, FiCalendar } from 'react-icons/fi'; 

/* import NewsInsight from '@/components/Home3/NewsInsight'; */
import Layout from '../global/Layout';
import withMetaData from '../providers/MetaDataProvider';


const {types, requestByType} = require("../apis/BlogApi");
const {Logger, TITLE_TAGS} = require("../util/Logger");

const BlogDetail = () => {
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(null);
    const [blogContentHTML, setBlogContentHTML] = useState("");
    const tempEditor = useCreateBlockNote();
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
            setBlogContentHTML(await prepareBlogHTML(response.data.content));
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
        navigate(`/blog?id=${id}`);
    };

    const prepareBlogHTML = async (serializedContent) => {
        try {
            const blocks = await JSON.parse(serializedContent);
            const rawHTML = await tempEditor.blocksToFullHTML(blocks);
            const styledHTML = mapDataTextColorToStyle(rawHTML);
            return DOMPurify.sanitize(styledHTML); 
        } catch (e) {
            console.error("Failed to render blog content:", e);
            return "<p>İçerik yüklenemedi.</p>";
        }
    };

    const mapDataTextColorToStyle = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
      
        tempDiv.querySelectorAll("[data-text-color]").forEach((el) => {
          const color = el.getAttribute("data-text-color");
          if (color) {
            el.style.color = color;
          }
        });
      
        return tempDiv.innerHTML;
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


                                <div className="flex items-center gap-2">
                                    {/* Author Card */}
                                    <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-lg shadow-sm">
                                        <FiFeather className="text-secondary text-lg" />
                                        <span className="caption1 text-secondary ml-1">{blogData?.author}</span>
                                    </div>

                                    <div className="line w-5 h-px bg-secondary" />

                                    {/* Date Card */}
                                    {blogData?.createdAt && (
                                        <div className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded-lg shadow-sm">
                                        <FiCalendar className="text-secondary text-lg" />
                                        <span className="caption1 text-secondary ml-1">
                                            {(() => {
                                            const date = new Date(blogData.createdAt);
                                            const pad = n => n.toString().padStart(2, '0');
                                            const turkishDays = [
                                                "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
                                            ];
                                            const dayName = turkishDays[date.getDay()];
                                            return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${dayName} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
                                            })()}
                                        </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="content md:mt-8 mt-5">
                                <div className="body1">{blogData?.description}</div>

                                <div className="blog-rich-content" dangerouslySetInnerHTML={{ __html: blogContentHTML }} />

                                {/* {blogData?.content?.split(' ').map((item, index) => {
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
                                } */}

                                


                            </div>
                            <div className="action flex items-center justify-between flex-wrap gap-5 md:mt-8 mt-5">
                                
                                
                                


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

BlogDetail.displayName = "blog-detail";
export default withMetaData(BlogDetail);