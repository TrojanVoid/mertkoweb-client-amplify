'use client'
import React from 'react'
import Breadcrumb from '../components/Breadcrumb';
import Benefit from '../components/Benefit'
import Layout from '../global/Layout';

const AboutContent = require("../data/AboutContent.json");

const About = () => {
    return (
        <Layout>
            <Breadcrumb heading='Hakkımızda' subHeading='Hakkımızda' />
            <div className='about md:pt-20 pt-10'>
                <div className="about-us-block">
                    <div className="container">
                        <div className="text flex items-center justify-center">
                            <div className="content md:w-5/6 w-full">
                                <div className="heading3 text-center">
                                    {
                                      AboutContent["title"]
                                    }
                                </div>
                                <div className="body1 text-center md:mt-7 mt-5">
                                    {
                                      AboutContent["content1"].split(' ').map((item, index) => {
                                        if(item == "<br/>") return (<br/>)
                                        return item + " "; 
                                      })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="list-img grid sm:grid-cols-3 gap-[30px] md:pt-20 pt-10">
                            <div className="bg-img">
                                <img
                                    src={'/images/other/about-us1.png'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                            <div className="bg-img">
                                <img
                                    src={'/images/other/about-us2.png'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                            <div className="bg-img">
                                <img
                                    src={'/images/other/about-us3.png'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px]'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Benefit props="md:pt-20 pt-10" />
            {/* <Newsletter props="bg-green md:mt-20 mt-10" />
            <Instagram />
            <Brand />
            <Footer /> */}
        </Layout>
    )
}

export default About