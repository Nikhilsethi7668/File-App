import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import HomeLayout from "./Layout/HomeLayout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Meeting from "./Pages/Meeting.jsx";
import Company from "./Pages/Company.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/Signup.jsx";
import ProtectedLogin from "./protectedRoutes/ProtectedLogin.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes (no protection) */}
      <Route path="/" element={<HomeLayout />}>
        <Route path="login" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedLogin>
            <HomeLayout />
          </ProtectedLogin>
        }
      >
        <Route index element={<Dashboard />} /> {/* Default route */}
        <Route path="meeting" element={<Meeting />} />
        <Route path="company" element={<Company />} />
      </Route>

      {/* Fallback route for invalid paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;