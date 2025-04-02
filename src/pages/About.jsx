import React, { useEffect, useState } from 'react'
import Breadcrumb from '../components/Breadcrumb';
import Benefit from '../components/Benefit'
import Layout from '../global/Layout';
import LocationMap from '../components/LocationMap';
import withMetaData from '../providers/MetaDataProvider';

const {requestByType, types} = require('../apis/AboutApi');

const About = () => {

    const [aboutData, setAboutData] = useState([]);
    const [aboutImages, setAboutImages] = useState([]);

    const fetchAboutData = async() => {
        try {
            const response = await requestByType(types.getAbout);
            const aboutImages = await requestByType(types.getAboutImages);
            setAboutImages(aboutImages.data);
            setAboutData(response.data);
        } catch (err) {
            console.error("About data fetch error:", err);
        }
    }

    useEffect(() => {
        fetchAboutData();
    }, []);

    return (
        <Layout>
            <Breadcrumb heading='MERTKO PLASTİK' subHeading='Hakkımızda' />
            <div className='md:pt-20 pt-10'>
                <div className="about-us-block">
                    <div className="container">
                        <div className="text flex items-center justify-center">

                            <div className="content md:w-5/6 w-full">

                            <h1 className="heading3 text-center mt-5">
                                {(aboutData && aboutData.title && aboutData.title.length > 0
                                    ? aboutData.title 
                                    : "HAKKIMIZDA"
                                )}
                            </h1>

                            <div className="w-100 d-flex flex-col md:flex-row justify-between items-center md:items-start gap-[6rem] sm:gap-[3rem] md:gap-[4rem] lg:gap-[6rem] md:mt-10">
                              {/* First Text Block */}
                              <div className="body1 text-center mt-5 md:!mt-7 w-[90%] md:w-1/2 pb-2 md:pb-5">
                                  {
                                    (aboutData && aboutData.content1 &&
                                      aboutData["content1"].split(' ').map((item, index) => {
                                          if (item === "<br/>") return (<br key={index} />);
                                          return item + " ";
                                      })
                                    )
                                  }
                              </div>

                              {/* Divider*/}
                              <div className="md:block self-stretch md:self-stretch w-full h-[0.5px] md:w-[1px] md:h-auto bg-black"></div>

                              {/* Second Text Block */}
                              <div className="body1 text-center mt-2 md:!mt-7 w-[90%] md:w-1/2 pb-5">
                                  {
                                    (aboutData && aboutData.content2 &&
                                      aboutData["content2"].split(' ').map((item, index) => {
                                          if (item === "<br/>") return (<br key={index} />);
                                          return item + " ";
                                      })
                                    )
                                  }
                              </div>
                            </div>



                          </div>
                        </div>

                        <div className="list-img flex flex-col md:flex-row flex-grow flex-shrink justify-center items-center gap-[30px] md:py-[5rem] py-[2rem]">
                            {
                                aboutImages?.map((image, index) => (
                                    <div key={index} className={`bg-img basis-[100%] md:basis-[30%] overflow-hidden`}>
                                        <img
                                            src={image.url}
                                            alt={image.altDescription}
                                            width={2000}
                                            height={3000}
                                            className='w-full rounded-[25px]'
                                        />
                                    </div>
                                )) 
                            }
                        </div>
                        <LocationMap />
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

export default withMetaData(About);