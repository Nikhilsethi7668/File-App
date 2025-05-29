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
        <DataContext.Provider 
            value={{ 
                fileUserData, 
                setFileUserData, 
                getUniqueCompanies,
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