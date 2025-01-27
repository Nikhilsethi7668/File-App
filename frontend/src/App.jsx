import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";
import UserSearch from "./components/UserSearch";
import BookingPage from "./components/BookingPage";
import Navbar from "./Components/Navbar";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<FileUpload />} /> {/* Landing Page */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
