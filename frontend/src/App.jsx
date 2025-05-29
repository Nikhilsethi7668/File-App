import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import HomeLayout from "./Layout/HomeLayout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Meeting from "./Pages/Meeting.jsx";
import Company from "./Pages/Company.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/Signup.jsx";
import ProtectedLogin from "./protectedRoutes/ProtectedLogin.jsx";
import ProtectedAdmin from "./protectedRoutes/Admin.jsx";
import DefaultPage from "./Pages/DefaultPage.jsx";
import CreateEvent from "./Pages/CreateEvent.jsx";
import EventDetail from "./Components/EventDetail.jsx";
import UpdateEvent from "./Pages/UpdateEvent.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes (no protection) */}
      <Route path="/" element={<HomeLayout />}>
        <Route path="login" element={<SignIn />} />

        <Route path="signup" element={<ProtectedAdmin>
          <SignUp />
        </ProtectedAdmin>} />
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
        <Route index element={<DefaultPage />} /> {/* Default route */}
        <Route path="/event/:id" element={<Dashboard />} />
        <Route path="/event/update/:id" element={<UpdateEvent />} />
        <Route path="dashboard" element={<></>} />
        <Route path="create" element={<CreateEvent />} />
        <Route path="meeting" element={<Meeting />} />
        <Route path="company" element={<Company />} />
      </Route>

      {/* Fallback route for invalid paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;