import React, { useContext, useEffect, useState } from "react";
import DataContext from "../Context/DataContext";

const Meeting = () => {
    const { fileUserData, setFileUserData } = useContext(DataContext);
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
            const userResponse = await fetch(
                "https://file-app-api.amiigo.in/api/files/get-filedata"
            );
            if (!userResponse.ok) throw new Error("Failed to fetch user data");
            const userData = await userResponse.json();

            const slotsResponse = await fetch(
                "http://localhost:4000/api/slot/get-all-booked-slots"
            );
            if (!slotsResponse.ok) throw new Error("Failed to fetch slots");
            const slotsData = await slotsResponse.json();

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
            const response = await fetch(
                `http://localhost:4000/api/slot/delete/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ slotTime }),
                }
            );

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
        if (Array.isArray(fileUserData) && fileUserData.length > 0) {
            setFilteredUsers(fileUserData);
        } else {
            setFilteredUsers([]);
        }
    }, [fileUserData]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredUsers(fileUserData);
            return;
        }

        const filtered = fileUserData.filter(
            (user) =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                user.title.toLowerCase().includes(query) ||
                user.company.toLowerCase().includes(query)
        );

        setFilteredUsers(filtered);
    };

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center md:text-left">
                Meeting Schedule
            </h2>

            {/* Search and Refresh Button */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : "Refresh Data"}
                </button>
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No attendees found</p>
            ) : (
                filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="mb-6 border rounded-lg p-4 md:p-6 bg-white shadow-md"
                    >
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {user.title} at {user.company}
                            </p>
                        </div>

                        {/* Scrollable Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-sm">
                                        {generateTimeSlots().map((slot) => (
                                            <th
                                                key={slot}
                                                className="border p-2 text-center font-medium text-gray-500"
                                            >
                                                {slot}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {generateTimeSlots().map((slot) => (
                                            <td key={slot} className="border p-2 text-center h-14">
                                                {user.slots && user.slots[slot] ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${user.slots[slot].completed
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
                                                            🗑️
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
