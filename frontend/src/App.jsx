import React from "react";
import { Route, Routes } from "react-router-dom";

import HomeLayout from "./Layout/HomeLayout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Meeting from "./Pages/Meeting.jsx";
import Company from "./Pages/Company.jsx";
import SignIn from "./Pages/SignIn.jsx.jsx";

function App() {
  return (
    <Routes>
      {/* Use HomeLayout as the wrapper */}
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Dashboard />} /> {/* Default route */}
        <Route path="meeting" element={<Meeting />} />
        <Route path="/company" element={<Company />} />

      </Route>
      <Route path="/login" element={<SignIn />} />
    </Routes>
  );
}

export default App;
