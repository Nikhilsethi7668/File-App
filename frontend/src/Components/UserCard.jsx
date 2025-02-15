import React, { useState, useEffect, useContext } from "react";
import Axios from "../Api/Axios";
import { CiClock2 } from "react-icons/ci";
import SlotsContext from "../Context/SlotsContext.jsx";

const UserCard = ({ user: initialUser, searchQuery, selectedByOptions, timeSlots = [] }) => {
    const [user, setUser] = useState(initialUser);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const { slots, fetchSlots } = useContext(SlotsContext);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const highlightMatch = (text) => {
        if (!searchQuery || !text) return text;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        return text.toString().split(regex).map((part, i) =>
            i % 2 === 1 ? (
                <mark key={i} className="bg-yellow-200">{part}</mark>
            ) : (
                part
            )
        );
    };

    const handleCompanyChange = (company) => {
        setSelectedCompany(company);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTime || !selectedCompany) {
            alert("Please select a company and a time slot.");
            return;
        }

        try {
            const data = { userId: user._id, timeSlot: selectedTime, company: selectedCompany };
            const response = await Axios.post(`/booking-slot`, data, {
                headers: { "Content-Type": "application/json" }
            });
            await fetchSlots();
            alert(response.data.message);
            setShowBookingForm(false);
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred while booking. Please try again.");
        }
    };

    const userBookedSlots = slots.filter(slot => slot.userId === user._id);
    const isTimeSlotBooked = (time) => userBookedSlots.some(slot => slot.timeSlot === time);

    return (
        <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white transition-all duration-200 hover:shadow-md w-full max-w-lg mx-auto md:max-w-2xl lg:max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{highlightMatch(user.firstName)} {highlightMatch(user.lastName)}</h3>
                    <p className="text-gray-600">{highlightMatch(user.title)} at {highlightMatch(user.company)}</p>
                    <div className="mt-2 text-sm">
                        <p>📧 {highlightMatch(user.email)}</p>
                        <p>📱 {highlightMatch(user.phone)}</p>
                        <p>🏷 Selected by: {user.selectedBy?.map(highlightMatch).join(", ") || "N/A"}</p>
                        {userBookedSlots.length > 0 && (
                            <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
                                <p className="font-medium flex items-center">
                                    <CiClock2 className="text-2xl text-red-500" /> Booked Slots:
                                </p>
                                <ul className="mt-1">
                                    {userBookedSlots.map((slot, index) => (
                                        <li key={index} className="text-gray-700">- {slot.timeSlot} by <span className="font-medium">{slot.company}</span></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setShowBookingForm(!showBookingForm)}
                    className={`px-4 py-2 rounded text-white transition-colors w-full md:w-auto ${Object.keys(user.slots || {}).length >= timeSlots.length ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    disabled={Object.keys(user.slots || {}).length >= timeSlots.length}
                >
                    {showBookingForm ? "✕ Close" : "📅 Book Slot"}
                </button>
            </div>

            {showBookingForm && (
                <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
                    <div className="mb-4">
                        <label className="block font-medium mb-2">🏢 Select One Company:</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedByOptions.map((company) => (
                                <label key={company} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                                    <input type="radio" name="company" value={company} checked={selectedCompany === company} onChange={() => handleCompanyChange(company)} className="form-radio h-4 w-4 text-blue-500" />
                                    <span>{company} {selectedCompany === company && "✅"}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium mb-2">⏰ Select Time Slot:</label>
                        <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" required>
                            <option value="">Select a time slot</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time} disabled={isTimeSlotBooked(time)}>
                                    {time} {isTimeSlotBooked(time) && "(Booked)"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-x-3 sm:space-y-0">
                        <button type="button" onClick={() => setShowBookingForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto">Cancel</button>
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto">Confirm Booking</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserCard;
