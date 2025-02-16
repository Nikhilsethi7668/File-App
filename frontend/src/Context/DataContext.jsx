import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [fileUserData, setFileUserData] = useState(null);

    const getUniqueCompanies = () => {
        if (!fileUserData) return [];
        const companies = new Set();
        fileUserData.forEach((user) => {
            if (user.selectedBy && user.selectedBy.length > 0) {
                user.selectedBy.forEach((company) => companies.add(company));
            }
        });
        return Array.from(companies);
    };

    return (
        <DataContext.Provider value={{ fileUserData, setFileUserData, getUniqueCompanies }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
