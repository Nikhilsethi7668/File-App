import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';

const Meeting = () => {
    const { userData, setUserData } = useContext(UserContext);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Generate time slots from 10:00 to 17:30
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour !== 17) slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    // Fetch user data
    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch users first
            const userResponse = await fetch("http://localhost:4000/api/files/get-filedata");
            if (!userResponse) throw new Error("Failed to fetch user data");
            const userData = await userResponse.json();

            // Fetch all booked slots
            const slotsResponse = await fetch("http://localhost:4000/api/slot/get-all-booked-slots");
            if (!slotsResponse.ok) throw new Error("Failed to fetch slots");
            const slotsData = await slotsResponse.json();

            // Map slots to users
            const usersWithSlots = userData.users.map(user => {
                const userSlots = {};
                slotsData.forEach(slot => {
                    if (slot.userId === user._id) {
                        userSlots[slot.timeSlot] = slot.company;
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

    // Delete a slot
    const deleteSlot = async (userId, slotTime) => {
        // Ask for confirmation before deleting
        const isConfirmed = window.confirm("Are you sure you want to delete this slot?");

        if (!isConfirmed) {
            return; // Exit if user cancels
        }

        try {
            const response = await fetch(`http://localhost:4000/api/slot/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotTime }),
            });

            if (!response.ok) throw new Error("Failed to delete slot");

            // Update local state after successful deletion
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

    // Effect to update filtered users when userData is updated
    useEffect(() => {
        if (Array.isArray(userData) && userData.length > 0) {
            setFilteredUsers(userData);
        } else {
            setFilteredUsers([]);
        }
    }, [userData]);

    // Handle search input change
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredUsers(userData); // Reset if search is cleared
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
            <h2 className="text-xl font-bold mb-4">Meeting Schedule</h2>

            {/* Search Input */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search attendees..."
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {/* Button to fetch data */}
            <button
                onClick={fetchData}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mb-6"
            >
                {loading ? "Fetching Data..." : "Fetch Attendees Data"}
            </button>

            {filteredUsers.length === 0 ? (
                <p className="text-gray-500">No attendees found</p>
            ) : (
                filteredUsers.map(user => (
                    <div key={user._id} className="mb-6 border rounded-lg p-4 shadow-sm">
                        <h3 className="text-lg font-bold mb-2">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {user.title} at {user.company}
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {generateTimeSlots().map(slot => (
                                            <th key={slot} className="border p-2 text-center">{slot}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {generateTimeSlots().map(slot => (
                                            <td key={slot} className="border p-2 text-center">
                                                {user.slots && user.slots[slot] ? (
                                                    <div className="flex items-center justify-center">
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                            {user.slots[slot]}
                                                        </span>
                                                        <button
                                                            onClick={() => deleteSlot(user._id, slot)}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                ) : '-'}
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