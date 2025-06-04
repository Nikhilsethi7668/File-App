import React, { createContext, useState, useEffect } from 'react';
import Axios from '../Api/Axios';
import { useParams } from 'react-router-dom';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [fileUserData, setFileUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); 
    const fetchData = async (eventId) => {
        if(!eventId){
            return
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await Axios.get("/files/get-filedata/"+eventId);
            if (response.status >= 300) {
                throw new Error("Failed to fetch data");
            }

            setFileUserData(response.data.users || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message || "Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };


   const getUniqueCompaniesWithUserCounts = () => {
    if (!fileUserData || !Array.isArray(fileUserData)) return [];
    
    // Create a map to store company counts
    const companyMap = new Map();
    
    fileUserData.forEach((user) => {
        if (user.selectedBy && Array.isArray(user.selectedBy)) {
            user.selectedBy.forEach((company) => {
                if (company) {
                    // Increment count for this company
                    const currentCount = companyMap.get(company) || 0;
                    companyMap.set(company, currentCount + 1);
                }
            });
        }
    });
    
    // Convert the map to an array of objects sorted by count (descending)
    return Array.from(companyMap.entries())
        .map(([company, count]) => ({
            company,
            userCount: count
        }))
        .sort((a, b) => b.userCount - a.userCount);
};
    
    return (
        <DataContext.Provider 
            value={{ 
                fileUserData, 
                setFileUserData, 
                getUniqueCompaniesWithUserCounts,
                isLoading,
                error,
                refetch: fetchData
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;