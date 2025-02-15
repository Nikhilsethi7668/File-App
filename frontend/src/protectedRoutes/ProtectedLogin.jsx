import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { Navigate } from "react-router-dom";

const ProtectedLogin = ({ children }) => {
    const { user, isAuthenticated } = useContext(UserContext);

    // Redirect to login if not authenticated
    console.log("user", user);
    console.log("isAuthenticated", isAuthenticated);
    if (!isAuthenticated || !user) {
        alert("Please login to continue");
        return <Navigate to="/login" replace />;
    }

    // Render the protected content if authenticated
    return children;
};

export default ProtectedLogin;