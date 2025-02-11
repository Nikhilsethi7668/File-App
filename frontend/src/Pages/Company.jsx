import { useState } from "react";
import React from 'react';

const Company = () => {
    const companies = ["Vmware", "Outsystems", "rackspace/google", "AWS WL"];
    const [users, setUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null); // Track which slot is updating
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);

    const fetchUsers = async (companyName) => {
        const encodedCompanyName = encodeURIComponent(companyName);
        setSelectedCompany(companyName);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:4000/api/slot/company/${encodedCompanyName}`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const slots = await response.json();

            const uniqueUsersMap = new Map();
            slots.forEach(slot => {
                const user = slot.userId;
                if (user && !uniqueUsersMap.has(user._id)) {
                    uniqueUsersMap.set(user._id, {
                        ...user,
                        slotId: slot._id,
                        completed: slot.completed
                    });
                }
            });

            const uniqueUsers = Array.from(uniqueUsersMap.values());
            setUsers(uniqueUsers);
            setCount(uniqueUsers.length);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCompletion = async (slotId, isCompleted) => {
        setUpdatingId(slotId); // Show loader on the specific button
        try {
            const response = await fetch(`http://localhost:4000/api/slot/toggle-completed/${slotId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !isCompleted }) // Toggle state
            });

            if (!response.ok) throw new Error('Failed to update status');

            // Fetch updated data
            if (selectedCompany) fetchUsers(selectedCompany);
        } catch (error) {
            console.error('Error updating slot status:', error);
        } finally {
            setUpdatingId(null); // Remove loader state
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Select a Company</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {companies.map((company) => (
                    <button
                        key={company}
                        onClick={() => fetchUsers(company)}
                        className={`p-4 rounded-lg transition-all duration-300 ${selectedCompany === company ? 'bg-blue-600 text-white transform scale-105 shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md hover:shadow-lg'}`}
                    >
                        {company}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {selectedCompany ? `${selectedCompany} Users` : 'Select a company to view users'}
                </h2>

                {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>}

                {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">Error: {error}</div>}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 gap-4">
                        <p className="text-gray-700 font-medium">Total users: {count}</p>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    className={`p-4 rounded-lg shadow-sm transition-shadow duration-300 border-l-4 ${user.completed ? 'bg-green-100 border-green-500' : 'bg-white border-blue-500'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">{user.firstName} {user.lastName}</h3>
                                            <p className="text-gray-600 text-sm">{user.email}</p>
                                            <p className="text-gray-500 text-sm mt-1">{user.title} • {user.phone}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {user.selectedBy?.length > 0 && (
                                                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                                                    Scheduled with: {user.selectedBy.join(', ')}
                                                </span>
                                            )}
                                            {user.completed ? (
                                                <button
                                                    onClick={() => toggleCompletion(user.slotId, user.completed)}
                                                    className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm hover:bg-yellow-700 transition-colors flex items-center"
                                                    disabled={updatingId === user.slotId}
                                                >
                                                    {updatingId === user.slotId ? (
                                                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                    ) : (
                                                        "Mark Incomplete"
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toggleCompletion(user.slotId, user.completed)}
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors flex items-center"
                                                    disabled={updatingId === user.slotId}
                                                >
                                                    {updatingId === user.slotId ? (
                                                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                    ) : (
                                                        "Mark Completed"
                                                    )}
                                                </button>
                                            )}
                                        </div>
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
