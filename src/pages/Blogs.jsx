import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import HandlePagination from "../util/HandlePagination";
import BlogItem from '../components/BlogItem';

import Layout from '../global/Layout';
import withMetaData from '../providers/MetaDataProvider';


const {Logger, TITLE_TAGS} = require("../util/Logger");
const {types, requestByType} = require("../apis/BlogApi");

const Blogs = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [blogs, setBlogs] = useState([]);
    const [currentBlogs, setCurrentBlogs] = useState([]);
    const [pageCount, setPageCount] =  useState(0);
    ;
    const blogsPerPage = 9;
    const offset = currentPage * blogsPerPage;
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await requestByType(types.getBlogs);
            const blogs = response.data
            setBlogs(blogs);
            setCurrentBlogs(blogs.slice(offset, offset + blogsPerPage));
            setPageCount(Math.ceil(blogs.length / blogsPerPage));
        } catch (error) {
            Logger.error(`Error fetching blogs: ${error}`, TITLE_TAGS.UI_COMPONENT);
            setBlogs([]);
        }
    }

    const selectCurrentBlogs = () => {
        setCurrentBlogs(blogs.slice(offset, offset + blogsPerPage));
    }

    const handleBlogClick = (blogId) => {
        navigate(`/blog?id=${blogId}`);
    };


    const handlePageChange = (selected) => {
        setCurrentPage(selected);
    };

    return (
        <Layout>
            <Breadcrumb heading='BLOGLAR' subHeading='Bloglar' />
     
            <div className='blog grid md:py-20 py-10'>
                <div className="container">
                    <div className="list-blog grid lg:grid-cols-3 sm:grid-cols-2 md:gap-[42px] gap-8">
                        {currentBlogs.map(item => (
                            <BlogItem key={item.id} data={item} type='style-one' />
                        ))}
                    </div>
                    {pageCount > 1 && (
                        <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                            <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

Blogs.displayName = "blogs";
export default withMetaData(Blogs);