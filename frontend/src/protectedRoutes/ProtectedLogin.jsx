import React, { useContext } from "react"
import { UserContext } from "../Context/UserContext"
import { Navigate } from "react-router-dom"
// import { useAuthStore } from "../Store/useAuthStore"

const ProtectedLogin = ({ children }) => {
    const { user, isAuthenticated } = useContext(UserContext)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedLogin 