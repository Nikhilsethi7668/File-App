import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';

const Meeting = () => {
    const { userData, setUserData } = useContext(UserContext);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour !== 17) slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const userResponse = await fetch("http://localhost:4000/api/files/get-filedata");
            if (!userResponse.ok) throw new Error("Failed to fetch user data");
            const userData = await userResponse.json();

            const slotsResponse = await fetch("http://localhost:4000/api/slot/get-all-booked-slots");
            if (!slotsResponse.ok) throw new Error("Failed to fetch slots");
            const slotsData = await slotsResponse.json();

            const usersWithSlots = userData.users.map(user => {
                const userSlots = {};
                slotsData.forEach(slot => {
                    if (slot.userId === user._id) {
                        userSlots[slot.timeSlot] = {
                            company: slot.company,
                            completed: slot.completed
                        };
                    }
                });
                return { ...user, slots: userSlots };
            });

            setUserData(usersWithSlots);
            setFilteredUsers(usersWithSlots || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteSlot = async (userId, slotTime) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this slot?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:4000/api/slot/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotTime }),
            });

            if (!response.ok) throw new Error("Failed to delete slot");

            setUserData(prevData =>
                prevData.map(user => {
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
        if (Array.isArray(userData) && userData.length > 0) {
            setFilteredUsers(userData);
        } else {
            setFilteredUsers([]);
        }
    }, [userData]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredUsers(userData);
            return;
        }

        const filtered = userData.filter(user =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.title.toLowerCase().includes(query) ||
            user.company.toLowerCase().includes(query)
        );

        setFilteredUsers(filtered);
    };

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Meeting Schedule</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search attendees..."
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Refresh Data"}
                </button>
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No attendees found</p>
            ) : (
                filteredUsers.map(user => (
                    <div key={user._id} className="mb-8 border rounded-xl p-6 bg-white shadow-md">
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {user.title} at {user.company}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        {generateTimeSlots().map(slot => (
                                            <th
                                                key={slot}
                                                className="border p-2 text-center text-sm font-medium text-gray-500"
                                            >
                                                {slot}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {generateTimeSlots().map(slot => (
                                            <td
                                                key={slot}
                                                className="border p-2 text-center h-14"
                                            >
                                                {user.slots && user.slots[slot] ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${user.slots[slot].completed
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            {user.slots[slot].company}
                                                        </span>
                                                        <button
                                                            onClick={() => deleteSlot(user._id, slot)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Delete slot"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Meeting;