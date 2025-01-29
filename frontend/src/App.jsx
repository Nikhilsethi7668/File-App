import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



// import Navbar from "./Components/Navbar";
import UploadFile from "./Pages/UploadFile.jsx";
// import Navbar from "./components/Navbar";

function App() {
  return (
    // <Router>
      // <Navbar/>
      <Routes>
        <Route path="/" element={<UploadFile />} /> {/* Landing Page */}
        
       
      </Routes>
    // </Router>
  );
}

export default App;
