import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';

const Meeting = () => {
    const { userData, setUserData } = useContext(UserContext);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false); // State to manage loading state

    // Generate time slots from 10:00 to 17:30
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour !== 17) slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    // Function to fetch user data
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:4000/api/files/get-filedata");
            if (!response.ok) throw new Error("Failed to fetch data");

            const jsonData = await response.json();
            setUserData(jsonData.users); // Update context with new data
            setFilteredUsers(jsonData.users || []); // Set filtered users state
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Effect to update filtered users when userData is updated
    useEffect(() => {
        console.log("User data in Meeting component:", userData);
        if (Array.isArray(userData) && userData.length > 0) {
            setFilteredUsers(userData); // Show all users if data is available
        } else {
            setFilteredUsers([]); // Reset filtered users if no data is available
        }
    }, [userData]);

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Meeting Schedule</h2>

            {/* Button to fetch data */}
            <button
                onClick={fetchData}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mb-6"
            >
                {loading ? "Fetching Data..." : "Fetch Attendees Data"}
            </button>

            {filteredUsers.length === 0 ? (
                <p className="text-gray-500">No data to show</p>
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
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                        {user.slots[slot]}
                                                    </span>
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