import React, { useState, useEffect, useContext } from "react";
import Axios from "../Api/Axios";
import { CiClock2 } from "react-icons/ci";
import SlotsContext from "../Context/SlotsContext.jsx";

const UserCard = ({ user: initialUser, searchQuery, selectedByOptions, timeSlots = [] }) => {
    const [user, setUser] = useState(initialUser);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const { slots, fetchSlots } = useContext(SlotsContext); // Use the context

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    // Highlight matching text in search results
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
        console.log(company);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTime || !selectedCompany) {
            alert("Please select a company and a time slot.");
            return;
        }

        try {
            const data = {
                userId: user._id,
                timeSlot: selectedTime,
                company: selectedCompany,
            };

            const response = await Axios.post(`/booking-slot`, data, {
                headers: { "Content-Type": "application/json" }
            });
            await fetchSlots(); // Refresh slots after booking
            console.log(response);
            alert(response.data.message);
            setShowBookingForm(false);

        } catch (error) {
            console.error("Error booking slot:", error);
            alert(error.response?.data?.message || "An error occurred while booking. Please try again.");
        }
    };

    // Filter slots for the current user
    const userBookedSlots = slots.filter(slot => slot.userId === user._id);

    // Check if a time slot is booked
    const isTimeSlotBooked = (time) => {
        return userBookedSlots.some(slot => slot.timeSlot === time);
    };

    return (
        <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                        {highlightMatch(user.firstName)} {highlightMatch(user.lastName)}
                    </h3>
                    <p className="text-gray-600">
                        {highlightMatch(user.title)} at {highlightMatch(user.company)}
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                        <p>📧 {highlightMatch(user.email)}</p>
                        <p>📱 {highlightMatch(user.phone)}</p>
                        <p>
                            🏷 Selected by: {user.selectedBy?.map(highlightMatch).join(", ") || "N/A"}
                        </p>
                        {/* Display Booked Slots */}
                        {userBookedSlots.length > 0 && (
                            <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
                                <p className="font-medium flex items-center">
                                    <CiClock2 className="text-2xl text-red-500" />
                                    Booked Slots:
                                </p>
                                <ul className="mt-1 space-y-1">
                                    {userBookedSlots.map((slot, index) => (
                                        <li key={index} className="text-gray-700">
                                            - {slot.timeSlot} by <span className="font-medium">{slot.company}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <button
  onClick={() => setShowBookingForm(!showBookingForm)}
  className={`ml-4 px-4 py-2 rounded text-white transition-colors ${
    userBookedSlots.length >= timeSlots.length
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600"
  }`}
  disabled={userBookedSlots.length >= timeSlots.length}
>
  {showBookingForm ? "✕ Close" : "📅 Book Slot"}
</button>
            </div>

            {showBookingForm && (
                <form onSubmit={handleSubmit} className="mt-4 border-t pt-4">
                    {/* Select One Company */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">🏢 Select One Company:</label>
                        <div className="grid grid-cols-2 gap-2">
                            {selectedByOptions.map((company) => (
                                <label
                                    key={company}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name="company"
                                        value={company}
                                        checked={selectedCompany === company}
                                        onChange={() => handleCompanyChange(company)}
                                        className="form-radio h-4 w-4 text-blue-500"
                                    />
                                    <span>{company} {selectedCompany === company && "✅"}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Select Time Slot */}
                    <div className="mb-4">
                        <label className="block font-medium mb-2">⏰ Select Time Slot:</label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a time slot</option>
                            {timeSlots.map((time) => (
                                <option
                                    key={time}
                                    value={time}
                                    disabled={isTimeSlotBooked(time)} // Disable booked slots
                                    className={isTimeSlotBooked(time) ? "text-red-500" : ""}
                                >
                                    {time} {isTimeSlotBooked(time) && <span className="text-red-500">(Booked {userBookedSlots.find(slot => slot.timeSlot === time)?.company} ❌)</span>}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowBookingForm(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserCard;