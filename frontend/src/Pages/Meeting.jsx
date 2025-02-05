import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';

const Meeting = () => {
    const { userData } = useContext(UserContext);
    const [timeSlots, setTimeSlots] = useState([]);
    const [bookingsData, setBookingsData] = useState([]);

    // Generate time slots from 10:00 to 17:30
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 10; hour <= 17; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour !== 17) slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        return slots;
    };

    // Fetch bookings data from backend
    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            setBookingsData(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        setTimeSlots(generateTimeSlots());
        fetchBookings();
    }, []);

    // Combine user data with bookings
    const getUsersWithBookings = () => {
        return (userData?.users || []).map(user => ({
            ...user,
            bookings: bookingsData.filter(booking => booking.userId === user._id)
        }));
    };

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">Meeting Schedule</h2>

            {getUsersWithBookings().length === 0 ? (
                <p className="text-gray-500">No data to show</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">First Name</th>
                            {timeSlots.map(slot => (
                                <th key={slot} className="border p-2 text-center">
                                    {slot}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getUsersWithBookings().map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="border p-2 font-medium">{user.firstName}</td>
                                {timeSlots.map(slot => {
                                    const booking = user.bookings.find(b => b.time === slot);
                                    return (
                                        <td key={slot} className="border p-2 text-center">
                                            {booking ? (
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                    {booking.company}
                                                </span>
                                            ) : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Meeting;