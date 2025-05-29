import React, { useState, useEffect } from 'react';
import { createContext } from 'react';
import Axios from '../Api/Axios';
import { useLocation } from 'react-router-dom'; 
// Create the context
const SlotsContext = createContext();

// Create the provider component
export const SlotsContextProvider = ({ children }) => {
    const [slots, setSlots] = useState([]);
    const location = useLocation();
    // Fetch all booked slots
    const fetchSlots = async () => {
        try {
            const response = await Axios.get('/slot/get-all-booked-slots');
            const data = response.data; // Use response.data for Axios
            console.log(data);
            setSlots(data);
        } catch (error) {
            console.error('Error fetching slots:', error);
            // alert('Error fetching slots: ' + error.message);
        }
    };

    // Fetch slots on component mount
    useEffect(() => {
       if (location.pathname.includes('event')) {
            fetchSlots();
        }
    }, []);

    return (
        <SlotsContext.Provider value={{ slots, setSlots, fetchSlots }}>
            {children}
        </SlotsContext.Provider>
    );
};

export default SlotsContext;