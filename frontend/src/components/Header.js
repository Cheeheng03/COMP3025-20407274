import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = React.forwardRef((props, ref) => {
    const [isOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isOpen);
    };

    return (
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between z-50 relative h-20 md:h-24">
        {/* Left - Mobile menu toggle */}
        <div className="flex items-center">
            <div className="md:hidden">
            <button onClick={toggleMenu}>
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            </div>
        </div>

        {/* Center - Main navigation */}
        <div className="flex-1 flex items-center justify-center space-x-8 font-neuemachina">
            <a href="/" className="hover:text-gray-400 text-lg">
            Landing Page
            </a>
            <a href="/credit-score" className="hover:text-gray-400 text-lg">
            Credit Scores Prediction
            </a>
        </div>

        {/* Right - (nothing, kept empty for balance) */}
        <div className="flex items-center">
            {/* Empty to keep layout centered */}
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
            <div className="mt-20 flex flex-col items-center space-y-6 text-xl">
            <a href="/" onClick={toggleMenu} className="text-white hover:text-gray-400">
                Landing Page
            </a>
            <a href="/credit-score" onClick={toggleMenu} className="text-white hover:text-gray-400">
                Credit Scores Prediction
            </a>
            </div>
        </div>
        </header>
    );
});

export default Header;
