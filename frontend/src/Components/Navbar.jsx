import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between">
            <h1 className="text-xl font-bold">MERN Dashboard</h1>
            <div>
                <Link to="/" className="mx-2">Upload File</Link>
                <Link to="/dashboard" className="mx-2">Dashboard</Link>
                <Link to="/search" className="mx-2">Search</Link>
                <Link to="/booking" className="mx-2">Booking</Link>
            </div>
        </nav>
    );
}

export default Navbar;
