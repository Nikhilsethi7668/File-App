import React, { useContext, useEffect, useState } from "react";
import DataContext from "../Context/DataContext";
import Axios from "../Api/Axios";
import { useParams } from 'react-router-dom';

const Meeting = () => {
    const { id } = useParams(); 
    const { fileUserData, setFileUserData,refetch } = useContext(DataContext);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
            if (hour !== 17) slots.push(`${hour.toString().padStart(2, "0")}:30`);
        }
        return slots;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const userResponse = await Axios.get("/files/get-filedata/"+id);
            if (!userResponse.status>300) throw new Error("Failed to fetch user data");
            const userData = await userResponse.data;
            const slotsResponse = await Axios.post("/slot/get-all-booked-slots",{event:id});
            if (!slotsResponse.status>300) throw new Error("Failed to fetch slots");
            const slotsData = await slotsResponse.data;

            const usersWithSlots = userData.users.map((user) => {
                const userSlots = {};
                slotsData.forEach((slot) => {
                    if (slot.userId === user._id) {
                        userSlots[slot.timeSlot] = {
                            company: slot.company,
                            completed: slot.completed,
                        };
                    }
                });
                return { ...user, slots: userSlots };
            });

             setFileUserData(usersWithSlots);
            setFilteredUsers(usersWithSlots);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSlot = async (userId, slotTime) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this slot?");
        if (!isConfirmed) return;

        try {
            const response = await Axios.delete(`/slot/delete/${userId}`, { data: { slotTime } });
            if (!response.ok) throw new Error("Failed to delete slot");

            setFileUserData((prevData) =>
                prevData.map((user) => {
                    if (user._id === userId) {
                        const updatedSlots = { ...user.slots };
                        delete updatedSlots[slotTime];
                        return { ...user, slots: updatedSlots };
                    }
                    return user;
                })
            );
        } catch (error) {
            console.error("Error deleting slot:", error);
            alert("Error deleting slot: " + error.message);
        }
    };
    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]); 
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(fileUserData);
        } else {
            const filtered = fileUserData.filter(
                (user) =>
                    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (user.title && user.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, fileUserData]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meeting Schedule</h1>
                    <p className="text-gray-600 mt-1">Manage all scheduled meetings</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search attendees..."
                            className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </>
                        )}
                    </button>
                </div>
            </div>

            {filteredUsers?.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No attendees found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or refresh the data</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredUsers?.map((user) => (
                        <div key={user._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {user.title} at {user.company}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <div className="min-w-max">
                                    <div className="grid grid-cols-16 gap-0 p-4">
                                        {generateTimeSlots().map((slot) => (
                                            <div key={slot} className="text-center py-3 px-2 border-b border-gray-200 font-medium text-xs text-gray-500">
                                                {slot}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-16 gap-0 p-4">
                                        {generateTimeSlots().map((slot) => (
                                            <div key={slot} className="h-20 border-b border-gray-200 flex items-center justify-center">
                                                {user.slots && user.slots[slot] ? (
                                                    <div className="flex flex-col items-center gap-1 w-full px-1">
                                                        <span
                                                            className={`w-full px-2 py-1 rounded text-xs font-medium ${user.slots[slot].completed
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {user.slots[slot].company}
                                                        </span>
                                                        <button
                                                            onClick={() => deleteSlot(user._id, slot)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                                                            title="Delete slot"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Meeting;