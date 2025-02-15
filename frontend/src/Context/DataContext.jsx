import React, { createContext, useState } from 'react'

export const DataContext = createContext()
export const DataContextProvider = ({ children }) => {
    const [fileUserData, setFileUserData] = useState(null);

    return (
        <DataContext.Provider value={{ fileUserData, setFileUserData }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext