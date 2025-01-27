import React, { useState, useEffect } from "react";
import axios from "axios";

function BookingPage() {
    const [users, setUsers] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const usersData = await axios.get("/api/users"); // API to fetch all users
            const slotsData = await axios.get("/api/slots"); // API to fetch time slots
            setUsers(usersData.data);
            setSlots(slotsData.data);
        };
        fetchData();
    }, []);

    const handleBooking = async () => {
        try {
            await axios.post("/api/slots/book", { userId: selectedUser, timeSlot: selectedSlot });
            alert("Time slot booked successfully");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Booking Page</h2>
            <div>
                <label>Select User:</label>
                <select onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Select Time Slot:</label>
                <select onChange={(e) => setSelectedSlot(e.target.value)}>
                    <option value="">Select a slot</option>
                    {slots.map((slot) => (
                        <option key={slot._id} value={slot.timeSlot}>
                            {slot.timeSlot} ({slot.status})
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleBooking} className="bg-blue-500 text-white p-2 rounded mt-4">
                Book Slot
            </button>
        </div>
    );
}

export default BookingPage;
