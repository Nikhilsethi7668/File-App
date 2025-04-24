import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../Context/DataContext";

const Company = () => {
    const { fileUserData, getUniqueCompanies } = useContext(DataContext);
    const [users, setUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        setCompanies(getUniqueCompanies());
    }, [fileUserData]);

    const fetchUsers = async (companyName) => {
        const encodedCompanyName = encodeURIComponent(companyName);
        setSelectedCompany(companyName);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://file-app-api.amiigo.in/api/slot/company/${encodedCompanyName}`);
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const slots = await response.json();

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
            const response = await fetch(`http://localhost:4000/api/slot/toggle-completed/${slotId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !isCompleted }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            if (selectedCompany) fetchUsers(selectedCompany);
        } catch (error) {
            console.error("Error updating slot status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Select a Company</h2>

            {companies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                    {companies.map((company) => (
                        <button
                            key={company}
                            onClick={() => fetchUsers(company)}
                            className={`p-3 rounded-lg text-lg font-medium transition-all duration-300 text-center w-full 
                                ${selectedCompany === company ? "bg-blue-600 text-white scale-105 shadow-lg" : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md"}
                            `}
                        >
                            {company}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    Please upload file first
                </div>
            )}

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    {selectedCompany ? `${selectedCompany} Users` : "Select a company to view users"}
                </h2>

                {isLoading && <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>}

                {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-center">Error: {error}</div>}

                {!isLoading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    className={`p-4 rounded-lg shadow-md transition-shadow duration-300 border-l-4 flex flex-col justify-between
                                        ${user.completed ? "bg-green-100 border-green-500" : "bg-white border-blue-500"}
                                    `}
                                >
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">{user.firstName} {user.lastName}</h3>
                                        <p className="text-gray-600 text-sm">{user.email}</p>
                                        <p className="text-gray-500 text-sm mt-1">{user.title} • {user.phone}</p>
                                    </div>
                                    <div className="mt-4 flex flex-col items-start sm:items-end">
                                        {user.selectedBy?.length > 0 && (
                                            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                                                Scheduled with: {user.selectedBy.join(", ")}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => toggleCompletion(user.slotId, user.completed)}
                                            className={`mt-3 px-3 py-2 w-full text-white rounded-lg text-sm flex justify-center items-center transition-all duration-300
                                                ${user.completed ? "bg-yellow-600 hover:bg-yellow-700" : "bg-blue-600 hover:bg-blue-700"}
                                            `}
                                            disabled={updatingId === user.slotId}
                                        >
                                            {updatingId === user.slotId ? (
                                                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
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
                                <div className="p-6 text-center text-gray-500 bg-white rounded-lg border-2 border-dashed w-full col-span-full">
                                    No users found for {selectedCompany}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Company;
