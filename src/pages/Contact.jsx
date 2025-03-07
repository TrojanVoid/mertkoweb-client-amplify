import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb';
import Layout from '../global/Layout';
import LocationMap from '../components/LocationMap';
import withMetaData from '../providers/MetaDataProvider';

const {requestByType, types} = require("../apis/ContactApi");

const Contact = () => {

    const [contactData, setContactData] = useState(null);

    const fetchContactData = async() => {
        try {
            const response = await requestByType(types.getContact);
            setContactData(response.data);
        } catch (err) {
            console.error("Contact data fetch error:", err);
        }
    }

    useEffect(() => {
        fetchContactData();
    }, []);

    // Loading state
    if (!contactData) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            <Breadcrumb heading='İLETİŞİM' subHeading='İletişim' />
            <div className='contact-us md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between max-lg:flex-col gap-y-10">
                        <div className="left lg:w-2/3 lg:pr-4">
                            <h1 className="heading3">Bize Ulaşın</h1>
                            <h2 className="body1 text-secondary2 mt-3">Bizimle iletişime geçmek için aşağıdaki formu doldurun</h2>
                            <form className="md:mt-6 mt-4">
                                <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 gap-y-5'>
                                    <div className="name ">
                                        <input className="border-line px-4 py-3 w-full rounded-lg" id="username" type="text" placeholder="İsminiz *" required />
                                    </div>
                                    <div className="email">
                                        <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="email" type="email" placeholder="E-Posta Adresiniz*" required />
                                    </div>
                                    <div className="message sm:col-span-2">
                                        <textarea className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="message" rows={3} placeholder="Mesajınız *" required />
                                    </div>
                                </div>
                                <div className="block-button md:mt-6 mt-4">
                                    <button className="button-main">Gönder</button>
                                </div>
                            </form>
                        </div>
                        <div className="right lg:w-1/4 lg:pl-4">

                            <address className="item">
                                <h2 className="heading4">Lokasyonumuz</h2>
                                <p className="mt-3">
                                  {contactData.address}
                                </p>
                                <p className="mt-3">
                                  Telefon: <a href={`tel:${contactData.phone}`} className='whitespace-nowrap'>{contactData.phone}</a>
                                </p>
                                <p className="mt-1">
                                  E-Posta: <a href={`mailto:${contactData.email}`} className='whitespace-nowrap'>{contactData.email}</a>
                                </p>
                            </address>

                            <div className="item mt-10">
                                <h2 className="heading4">Çalışma Saatlerimiz</h2>
                                <p className="mt-3">
                                   Haftaiçi: <span className='whitespace-nowrap'>{contactData.workingHours.weekDays[0]} - {contactData.workingHours.weekDays[1]}</span>
                                </p>
                                <p className="mt-3">
                                  Cumartesi: <span className='whitespace-nowrap'>{contactData.workingHours.saturday[0]} - {contactData.workingHours.saturday[1]}</span>
                                </p>
                                <p className="mt-3">
                                  Pazar: <span className='whitespace-nowrap'>{contactData.workingHours.sunday[0]} - {contactData.workingHours.sunday[1]}</span>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-map w-[90%] mx-auto md:mt-20 mt-10">
                <div className="container">
                    <div className="map">
                        <LocationMap />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default withMetaData(Contact);
