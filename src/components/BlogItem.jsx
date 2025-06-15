import { useNavigate } from 'react-router-dom';
/* import { BlogType } from '@/type/BlogType' */
import * as Icon from "@phosphor-icons/react/dist/ssr";

import { FiFeather, FiCalendar } from 'react-icons/fi'; 

const BlogItem = ({ data, type }) => {
    const navigate = useNavigate();

    
    const handleBlogClick = (blogId) => {
        // Go to blog detail with blogId selected
        navigate(`/blog?id=${blogId}`);
    };

    return (
        <>
            {type === "style-one" ? (
                <div
                    className="blog-item style-one h-full cursor-pointer outline outline-1 outline-gray-200 pb-3 rounded-[20px] overflow-hidden shadow-sm hover:!shadow-none hover:outline-gray-300 hover:scale-[97%] hover:-translate-y-[2px] transition-all duration-300 will-change-transform"
                    onClick={() => handleBlogClick(data.id)}
                >
                    <div className="blog-main h-full block">
                        <div className="blog-thumb rounded-[20px] overflow-hidden">
                            <img
                                src={data.images?.[0]?.imageUrl}
                                width={2000}
                                height={1500}
                                alt='blog-img'
                                className='w-full duration-500 object-cover'
                            />
                        </div>
                        <div className="blog-infor mt-7 px-3 flex flex-col justify-between items-start h-[15vh]">
                            
                            {/* <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">{data.tag}</div> */}
                            
                            <div className="heading6 blog-title mt-3 duration-300">{data.title}</div>
                            <div className="flex w-full justify-end items-center gap-2 mt-2">
                                {/* Author Card */}
                                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg shadow-sm">
                                    <FiFeather className="text-secondary text-sm" />
                                    <span className="caption1 text-secondary ml-1">{data?.author}</span>
                                </div>

                                <div className="line w-3 h-px bg-secondary" />

                                {/* Date Card */}
                                {data?.createdAt && (
                                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg shadow-sm">
                                    <FiCalendar className="text-secondary text-sm" />
                                    <span className="caption1 text-secondary ml-1">
                                        {(() => {
                                        const date = new Date(data.createdAt);
                                        const pad = n => n.toString().padStart(2, '0');
                                        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
                                        })()}
                                    </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {type === "style-list" ? (
                        <div
                            className="blog-item style-list h-full cursor-pointer"
                            onClick={() => handleBlogClick(data.id)}
                        >
                            <div className="blog-main h-full flex max-md:flex-col md:items-center md:gap-9 gap-6">
                                <div className="blog-thumb md:w-1/2 w-full rounded-[20px] overflow-hidden flex-shrink-0">
                                    <img
                                        src={data.thumbImg}
                                        width={2000}
                                        height={1500}
                                        alt='blog-img'
                                        className='w-full duration-500 flex-shrink-0'
                                    />
                                </div>
                                <div className="blog-infor">
                                    <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">{data.tag}</div>
                                    <div className="heading6 blog-title mt-3 duration-300">{data.title}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="blog-author caption1 text-secondary">by {data.author}</div>
                                        <span className='w-[20px] h-[1px] bg-black'></span>
                                        <div className="blog-date caption1 text-secondary">{data.date}</div>
                                    </div>
                                    <div className="body1 text-secondary mt-4">{data.shortDesc}</div>
                                    <div className="text-button underline mt-4">Read More</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {type === "style-default" && (
                                <div
                                    className="blog-item style-default h-full cursor-pointer"
                                    onClick={() => handleBlogClick(data.id)}
                                >
                                    <div className="blog-main h-full block pb-8 border-b border-line">
                                        <div className="blog-thumb rounded-[20px] overflow-hidden">
                                            <img
                                                src={data.thumbImg}
                                                width={2000}
                                                height={1500}
                                                alt='blog-img'
                                                className='w-full duration-500'
                                            />
                                        </div>
                                        <div className="blog-infor mt-7">
                                            <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">{data.tag}</div>
                                            <div className="heading6 blog-title mt-3 duration-300">{data.title}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="blog-author caption1 text-secondary">by {data.author}</div>
                                                <span className='w-[20px] h-[1px] bg-black'></span>
                                                <div className="blog-date caption1 text-secondary">{data.date}</div>
                                            </div>
                                            <div className="body1 text-secondary mt-4">{data.shortDesc}</div>
                                            <div className="text-button underline mt-4">Read More</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )
                    }
                </>
            )
            }
        </>
    )
}

export default BlogItem