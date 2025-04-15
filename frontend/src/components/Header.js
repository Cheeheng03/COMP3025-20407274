import React, { useState } from 'react';
import { FaBars, FaSignInAlt, FaTimes,  } from 'react-icons/fa';
import logo from '../assets/images/logo.png'

const Header = React.forwardRef((props, ref) => {
    const [isOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isOpen);
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between z-50 relative">
            <div className="flex items-center">
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                <div className="hidden md:block">
                    <img src={logo} alt="Logo" className="h-10 w-28" />
                </div>
            </div>

            <div className="flex-1 hidden md:flex items-center justify-center space-x-6 font-neuemachina">
                <a href="/credit-score" className="hover:text-gray-400">Credit Scores Prediction</a>
            </div>

            <div className="flex items-center">
                <FaSignInAlt size={24} />
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-900 p-4 z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:hidden`}
                style={{ width: '100%' }}
            >
                <button onClick={toggleMenu} className="absolute top-4 right-4">
                    <FaTimes size={24} />
                </button>
                <div className="mt-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-700 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                    <a href="/credit-score" className="block text-white hover:text-gray-400">News</a>
                </div>
            </div>
        </header>
    );
});

export default Header;
