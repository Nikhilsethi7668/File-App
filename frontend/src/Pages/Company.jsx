import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../Context/DataContext";
import Axios from "../Api/Axios";
import { useParams } from 'react-router-dom';

const Company = () => {
    const { id } = useParams(); 
    const { fileUserData, getUniqueCompanies,refetch } = useContext(DataContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState();

    useEffect(() => {
        setCompanies(getUniqueCompanies());
    }, [fileUserData]);

    useEffect(() => {
        setSelectedCompany(companies?.at(0))
        fetchUsers(companies?.at(0))
    }, [companies]);

        useEffect(() => {
            if (id) {
                refetch(id);
            }
        }, [id]); 

    const fetchUsers = async (companyName) => {
        const encodedCompanyName = encodeURIComponent(companyName);
        setSelectedCompany(companyName);
        setIsLoading(true);
        setError(null);

        try {
            const response = await Axios.post(`/slot/company/${encodedCompanyName}`,{event:id});
            if (!response.status>300) {
                throw new Error("Failed to fetch users");
            }
            const slots = await response.data;

            const uniqueUsersMap = new Map();
            slots.forEach((slot) => {
                const user = slot.userId;
                if (user && !uniqueUsersMap.has(user._id)) {
                    uniqueUsersMap.set(user._id, {
                        ...user,
                        slotId: slot._id,
                        completed: slot.completed,
                    });
                }
            });

            setUsers(Array.from(uniqueUsersMap.values()));
            setCount(uniqueUsersMap.size);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCompletion = async (slotId, isCompleted) => {
        setUpdatingId(slotId);
        try {
            const response = await Axios.post(`/slot/toggle-completed/${slotId}`,{ completed: !isCompleted })

            if (!response.status>300) throw new Error("Failed to update status");

            if (selectedCompany) fetchUsers(selectedCompany);
        } catch (error) {
            console.error("Error updating slot status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                        Company Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Select a company to view and manage user interviews
                    </p>
                </div>

                {companies.length > 0 ? (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 px-2">
                            Available Companies
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {companies.map((company) => (
                                <button
                                    key={company}
                                    onClick={() => fetchUsers(company)}
                                    className={`p-3 rounded-xl text-base font-medium transition-all duration-300 text-center w-full 
                                        ${selectedCompany === company 
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02] ring-2 ring-blue-300" 
                                            : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                                        }
                                        hover:shadow-md hover:-translate-y-0.5
                                    `}
                                >
                                    <span className="truncate block">{company}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-6 shadow-sm text-center border-2 border-dashed border-gray-200">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No companies available</h3>
                        <p className="mt-1 text-gray-500">Please upload a file first to view companies</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {selectedCompany ? `${selectedCompany} Users` : "Select a company"}
                        </h2>
                        {selectedCompany && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {count} {count === 1 ? 'user' : 'users'}
                            </span>
                        )}
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
                                <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
                                    <p className="mt-1 text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <div
                                            key={user._id}
                                            className={`p-5 rounded-xl transition-all duration-200 border-l-[6px] flex flex-col sm:flex-row justify-between gap-4
                                                ${user.completed 
                                                    ? "bg-green-50 border-green-500 hover:shadow-sm" 
                                                    : "bg-gray-50 border-blue-500 hover:shadow-sm"
                                                }
                                            `}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {user.title && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                    {user.title}
                                                                </span>
                                                            )}
                                                            {user.phone && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {user.phone}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {user.selectedBy?.length > 0 && (
                                                    <div className="mt-3">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Scheduled with: {user.selectedBy.join(", ")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0 sm:w-40">
                                                <button
                                                    onClick={() => toggleCompletion(user.slotId, user.completed)}
                                                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2
                                                        ${user.completed 
                                                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                        }
                                                    `}
                                                    disabled={updatingId === user.slotId}
                                                >
                                                    {updatingId === user.slotId ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            <span>Processing</span>
                                                        </>
                                                    ) : user.completed ? (
                                                        "Mark Incomplete"
                                                    ) : (
                                                        "Mark Completed"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    selectedCompany && !isLoading && (
                                        <div className="text-center py-10">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
                                            <p className="mt-1 text-gray-500">No users found for {selectedCompany}</p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Company;