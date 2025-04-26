import React, { useState, useEffect } from 'react';
import landingbg from '../assets/images/landingbg.jpg';
import python from '../assets/images/poweredby/python.png';
import moralis from '../assets/images/poweredby/moralis.png';
import chainlink from '../assets/images/poweredby/chainlink.png';
import ethereum from '../assets/images/poweredby/ethereum.png'
import react from '../assets/images/poweredby/react.png';
import footerimage from '../assets/images/footer.png';
import landinggif from '../assets/images/landinggif.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCogs, faDatabase } from '@fortawesome/free-solid-svg-icons';
import FicoGauge from "../components/FicoGauge";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Landing = ({ headerHeight }) => {
    const [containerHeight, setContainerHeight] = useState(`calc(100vh - ${headerHeight}px)`);
    const [currentWord, setCurrentWord] = useState("optimizing");
    const words = ["transparent", "trustworthy", "predictable"];
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        setContainerHeight(`calc(100vh - ${headerHeight}px)`);
    }, [headerHeight]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentWord((prevWord) => {
                    const currentIndex = words.indexOf(prevWord);
                    const nextIndex = (currentIndex + 1) % words.length;
                    return words[nextIndex];
                });
                setFadeIn(true);
            }, 500);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [words]);

    return (
        <div className='bg-black'>
            <div className='bg-black w-full'>
                <div 
                    className="bg-cover bg-center bg-no-repeat flex flex-col items-start justify-center w-full" 
                    style={{ 
                        backgroundImage: `url(${landingbg})`, 
                        minHeight: containerHeight 
                    }} 
                >
                    <div className='w-full lg:w-2/3 mx-auto text-center p-4 mt-5 2xl:mt-20 flex items-center flex-col'>
                        <h1 className="text-white font-bold text-2xl lg:text-5xl mb-6 leading-tight font-mono">
                            Your <span className={`text-[#00E4BF] transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>{currentWord}</span> Web3 Credit Scoring Platform.
                        </h1>
                        <p className='text-gray-400 text-sm lg:text-xl font-light leading-relaxed w-full'>
                            A decentralized AI-powered platform analyzing on-chain activity to generate accurate, trustless credit scores—enabling secure, transparent, and data-driven lending decisions in DeFi.
                        </p>


                        <div className="flex justify-center space-x-6 mt-8">
                            <a href="/credit-score">
                                <button
                                    className="relative bg-[#4ec7b3] font-bold py-2 px-4 rounded-full w-40 overflow-hidden group"
                                >
                                    <span className="relative z-10 bg-black text-transparent bg-clip-text font-neue-machina font-bold group-hover:text-white transition-colors duration-500">
                                        Calculate Now
                                    </span>
                                    <span className="rounded-full absolute inset-0 bg-gradient-to-r from-[#00E4BF] via-blue-400 to-purple-600 transition-transform duration-500 transform translate-x-full group-hover:translate-x-0 z-0"></span>
                                </button>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full font-mono">
                            <div className="bg-gray-800 text-white rounded-lg p-6 text-center">
                                <FontAwesomeIcon icon={faChartLine} className="text-gray-500 text-4xl mb-4" />
                                <h3 className="text-gray-500 text-lg font-bold">Average Model Accuracy</h3>
                                <p className="text-[#4ec7b3] text-3xl font-semibold">~98%</p>
                            </div>

                            <div className="bg-gray-800 text-white rounded-lg p-6 text-center">
                                <FontAwesomeIcon icon={faCogs} className="text-gray-500  text-4xl mb-4" />
                                <h3 className="text-gray-500 text-lg font-bold">Total Models Trained</h3>
                                <p className="text-[#4ec7b3] text-3xl font-semibold">3</p>
                            </div>

                            <div className="bg-gray-800 text-white rounded-lg p-6 text-center">
                                <FontAwesomeIcon icon={faDatabase} className="text-gray-500  text-4xl mb-4" />
                                <h3 className="text-gray-500 text-lg font-bold">Blockchain</h3>
                                <p className="text-[#4ec7b3] text-3xl font-semibold">Ethereum</p>
                            </div>
                        </div>
                    </div>

                    {/* Powered By Section */}
                    <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center lg:space-x-6 mt-5 lg:mt-10 mb-4 p-4 w-full">
                        <p className="text-gray-400 text-md md:text-base">Powered by:</p>
                        <img src={python} alt="Python" className="h-16 p-2" />
                        <img src={react} alt="React" className="h-16 p-2" />
                        <img src={moralis} alt="Moralis" className="h-16 p-2" />
                        <img src={chainlink} alt="Chainlink" className="h-32 p-2" />
                        <img src={ethereum} alt="Ethereum" className="h-24 p-2" />  
                    </div>
                </div>
            </div>

            <section className="bg-black text-center mb-28 p-8" style={{ height: '600px' }}>
                <div 
                    className="flex flex-col items-center justify-center h-full rounded-3xl mx-auto w-full lg:w-2/3 2xl:w-1/2 p-6" 
                    style={{ 
                        backgroundImage: `url(/movingparticlesbg.svg)`, 
                        backgroundSize: 'cover',             
                        backgroundRepeat: 'no-repeat',     
                        backgroundPosition: 'center',        
                    }}
                >
                    <div className="text-[#00E4BF] mb-4 inline-block py-1 px-4 border border-[#00E4BF] rounded-full w-36">
                        DeFi Lenders
                    </div>
                    <h2 className="text-white text-5xl lg:text-7xl font-bold mb-4 font-mono">
                        Smarter Lending. Safer Borrowing.
                    </h2>
                    <p className="text-gray-400 text-lg lg:text-xl ">
                        Our AI-driven Web3 credit scoring platform analyzes on-chain activity to assess risk, optimize lending decisions, and ensure collateral protection in DeFi protocols. 
                    </p>
                </div>
            </section>


            {/* Video Section */}         
            {/* <section>
                <div className="text-[#00E4BF] mb-4 inline-block py-1 px-4 border border-[#00E4BF] rounded-full mt-10 lg:mt-20">
                    Demo Video
                </div>
                <div className='w-full flex flex-col lg:flex-row items-center justify-center p-10 lg:px-20'>
                    <div className="text-white w-full sm:w-full lg:w-[40%] pr-0 lg:pr-8">
                        <h3 className="text-5xl mb-4 font-mono font-semibold uppercase">Trade now using our model</h3>
                        <p className="text-gray-400 mb-4 font-light font-neue-machina text-lg lg:text-xl">
                            Leveraging our AI models, we predict stock prices and recommend the best warrants. Enable informed decisions using the latest data analytics.
                        </p>
                    </div>
                    <div className="w-full sm:w-full lg:w-[40%]">
                        <div className="bg-gray-800 rounded-xl cursor-pointer" onClick={() => handleVideoClick(testvideo)}>
                            <div className="bg-gray-700 rounded-xl border-2 border-gray-800 ">
                                <video
                                    ref={videoElementRef}
                                    src={testvideo}
                                    className="w-full h-auto object-cover p-4"
                                    autoPlay
                                    loop
                                    muted
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* {activeVideoSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative bg-black p-6 rounded-lg shadow-lg">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-white text-2xl">
                            &times;
                        </button>
                        <video src={activeVideoSrc} className="w-full h-full max-w-4xl" controls autoPlay />
                    </div>
                </div>
            )} */}

            <section className="bg-black p-8 pt-0 text-center mt-10 lg:mt-28 mb-20 lg:mb-36">
                <div className='flex flex-col items-center justify-center'>
                    <div className="text-[#00E4BF] mb-4 inline-block py-1 px-4 border border-[#00E4BF] rounded-full mt-10 lg:mt-20">
                        AI Prediction
                    </div>
                    <div className='bg-black w-full flex flex-col justify-center items-center'>
                        <div 
                            className="bg-center bg-no-repeat flex flex-col items-center justify-center" 
                            style={{ 
                                backgroundImage: `url(${landinggif})`, 
                                height: '300px',
                                width: '600px',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                            }} 
                        >
                        </div>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-bold text-white mb-4">AI-Powered On-Chain Credit Scoring</h2>
                    <p className="text-gray-400 mb-6">Leverage our AI-driven platform to assess creditworthiness based on on-chain activity, enabling secure and transparent lending decisions in DeFi.</p>
                    
                    <div className="w-full lg:w-2/3 h-200px">
                        <div className="flex flex-col items-center justify-center text-white">
                            <FicoGauge score={688} />
                        </div>
                    </div>

                    <a href="/credit-score">
                        <button
                            className="relative bg-[#4ec7b3] font-bold py-2 px-4 rounded-full w-56 mt-10 overflow-hidden group"
                        >
                            <span className="relative z-10 bg-black text-transparent bg-clip-text font-neue-machina font-bold group-hover:text-white transition-colors duration-500 text-lg">
                                Check It Out Now !
                            </span>
                            <span className="rounded-full absolute inset-0 bg-gradient-to-r from-[#00E4BF] via-blue-400 to-purple-600 transition-transform duration-500 transform translate-x-full group-hover:translate-x-0 z-0"></span>
                        </button>
                    </a>
                </div>   
            </section>

            <section className="p-0 m-0">
                <div className='bg-black w-full flex flex-col justify-center items-center'>
                    <p className='text-md text-gray-400 font-neuemachina mb-10'>@ 2024 Tang Chee Heng FYP. All Rights Reserved</p>
                    <div 
                        className="bg-center bg-no-repeat flex flex-col items-center justify-center" 
                        style={{ 
                            backgroundImage: `url(${footerimage})`, 
                            height: '300px',
                            width: '600px',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                        }} 
                    >
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Landing;
