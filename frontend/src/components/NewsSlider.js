import React from 'react';
import Slider from 'react-slick';
import news1 from '../assets/images/News/news1.jpg';
import news2 from '../assets/images/News/news2.jpg';
import news3 from '../assets/images/News/news3.jpeg';

const newsItems = [
    {
        category: 'Technology',
        date: 'Oct 12, 2024',
        title: 'AI Revolution in Tech Industry',
        image: news1,
    },
    {
        category: 'Medical',
        date: 'Sep 20, 2024',
        title: 'Breakthrough in Cancer Research',
        image: news2,
    },
    {
        category: 'Finance',
        date: 'Aug 10, 2024',
        title: 'Stock Markets Hit All-Time High',
        image: news3,
    },
    ];

const NewsSection = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
        {
            breakpoint: 1024,
            settings: {
            slidesToShow: 2,
            },
        },
        {
            breakpoint: 600,
            settings: {
            slidesToShow: 1,
            },
        },
        ],
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Technology':
                return 'text-blue-500';
            case 'Medical':
                return 'text-green-300';
            case 'Finance':
                return 'text-orange-500';
            default:
                return 'text-gray-400'; 
        }
    };

    return (
        <section className="bg-black text-white py-8">
            <div className="container mx-auto">
                <div className='flex w-full flex-col lg:flex-row px-4 py-2 items-center justify-between mb-2 lg:mb-6'>
                    <h2 className="text-4xl font-bold text-center mb-4 lg:mb-0">Latest News</h2>
                    <button
                        className="relative bg-[#4ec7b3] font-bold py-2 px-4 rounded-full w-40 overflow-hidden group"
                    >
                        <span className="relative z-10 bg-black text-transparent bg-clip-text font-neue-machina font-bold group-hover:text-white transition-colors duration-500">
                            View All
                        </span>
                        <span className="rounded-full absolute inset-0 bg-gradient-to-r from-[#00E4BF] via-blue-400 to-purple-600 transition-transform duration-500 transform translate-x-full group-hover:translate-x-0 z-0"></span>
                    </button>
                </div>
                <Slider {...settings}>
                    {newsItems.map((news, index) => (
                        <div key={index} className="p-4">
                            <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full" style={{ minHeight: '350px' }}>
                                <img 
                                    src={news.image} 
                                    alt={news.title} 
                                    className="w-full h-48 object-cover" 
                                />
                                <div className="p-4 flex-grow flex flex-col justify-start">
                                    <span className="text-sm text-gray-400">
                                        <span className={`${getCategoryColor(news.category)} uppercase font-semibold font-mono text-xl`}>
                                            {news.category}
                                        </span> • {news.date}
                                    </span>
                                    <h3 className="text-2xl mt-6 font-neuemachina">{news.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default NewsSection;
