import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Assume you have an AuthContext for managing authentication

const Navbar = () => {
    const { isAuthenticated, login, logout } = useContext(AuthContext);

    return (
        <nav className="bg-blue-500 p-4 flex justify-between items-center">
            {/* Left: Logo */}
            <div className="text-white text-xl font-bold">
                <Link to="/">Meeting</Link>
            </div>

            {/* Middle: Navigation Links */}
            <div className="flex space-x-4">
                <Link to="/" className="text-white">BookUserSlots</Link>
                <Link to="/meeting" className="text-white">CheckUserBooking</Link>
                <Link to="/company" className="text-white">CompanyData</Link>
            </div>


            {/* Right: Login/Logout Button */}
            <div>
                {isAuthenticated ? (
                    <button onClick={logout} className="text-white bg-red-500 px-4 py-2 rounded">
                        Logout
                    </button>
                ) : (
                    <button onClick={login} className="text-white bg-green-500 px-4 py-2 rounded">
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;