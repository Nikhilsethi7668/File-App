import { useEffect, useState } from "react";
import React from 'react';

const Company = () => {
    const companies = ["Vmware", "Outsystems", "rackspace/google", "AWS WL"];
    const [users, setUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);

    const fetchUsers = async (companyName) => {
        const encodedCompanyName = encodeURIComponent(companyName); // Encode the company name
        setSelectedCompany(companyName);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:4000/api/files/company/${encodedCompanyName}`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
            setCount(data.length);
            console.log(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        setCount(users.length); // Ensures count updates when users change
    }, [users]); // Dependency array includes 'users' to track changes

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Select a Company
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {companies.map((company) => (
                    <button
                        key={company}
                        onClick={() => fetchUsers(company)}
                        className={`p-4 rounded-lg transition-all duration-300 ${selectedCompany === company
                            ? 'bg-blue-600 text-white transform scale-105 shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'
                            } font-medium text-sm uppercase tracking-wide`}
                    >
                        {company}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {selectedCompany ? `${selectedCompany} Users` : 'Select a company to view users'}
                </h2>

                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                        Error: {error}
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 gap-4">
                        <p className="text-gray-700 font-medium">Total users: {count}</p>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-blue-500"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className="text-gray-600 text-sm">{user.email}</p>
                                        </div>
                                        {user.meetingSlot && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                Meeting: {user.meetingSlot}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            selectedCompany && !isLoading && (
                                <div className="p-6 text-center text-gray-500 bg-white rounded-lg border-2 border-dashed">
                                    No users found for {selectedCompany}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Company;
