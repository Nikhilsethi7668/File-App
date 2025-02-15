import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { FiMenu, FiX } from 'react-icons/fi'; // Import icons for mobile menu

const Navbar = () => {
    const { isAuthenticated, login, logout } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-blue-500 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-white text-xl font-bold">
                    <Link to="/">Meeting</Link>
                </div>

                {/* Desktop Navigation (Hidden on small screens) */}
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="text-white hover:text-gray-200 transition">BookUserSlots</Link>
                    <Link to="/meeting" className="text-white hover:text-gray-200 transition">CheckUserBooking</Link>
                    <Link to="/company" className="text-white hover:text-gray-200 transition">CompanyData</Link>
                </div>

                {/* Authentication Buttons (Hidden on small screens) */}
                <div className="hidden md:flex">
                    {isAuthenticated ? (
                        <button onClick={logout} className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
                            Logout
                        </button>
                    ) : (
                        <button onClick={login} className="text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white text-2xl focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col bg-blue-600 text-white p-4 space-y-4">
                    <Link to="/" className="hover:text-gray-200 transition" onClick={() => setIsOpen(false)}>BookUserSlots</Link>
                    <Link to="/meeting" className="hover:text-gray-200 transition" onClick={() => setIsOpen(false)}>CheckUserBooking</Link>
                    <Link to="/company" className="hover:text-gray-200 transition" onClick={() => setIsOpen(false)}>CompanyData</Link>
                    {isAuthenticated ? (
                        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition">
                            Logout
                        </button>
                    ) : (
                        <button onClick={login} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition">
                            Login
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
