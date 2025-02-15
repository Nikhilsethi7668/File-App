import React from "react";
import { Route, Routes } from "react-router-dom";

import HomeLayout from "./Layout/HomeLayout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Meeting from "./Pages/Meeting.jsx";
import Company from "./Pages/Company.jsx";
import SignIn from "./Pages/SignIn.jsx.jsx";
import ProtectedLogin from "./protectedRoutes/ProtectedLogin.jsx";
import { CiSignpostDuo1 } from "react-icons/ci";
import SignUp from "./Pages/Signup.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedLogin />}>
        {/* Use HomeLayout as the wrapper */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Dashboard />} /> {/* Default route */}
          <Route path="meeting" element={<Meeting />} />
          <Route path="/company" element={<Company />} />

        </Route>
      </Route>
      <Route path="/" element={<HomeLayout />}>
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default App;
