import React, { createContext, useState } from 'react'

export const UserContext = createContext()
export const UserProvider = ({ children }) => {
    const[userData, setUserData]= useState(null);
    
    return (
        <div>

        </div>
    )

}





export default UserContext
