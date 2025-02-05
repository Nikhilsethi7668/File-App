import React, { useState } from "react";
import Axios from "../Api/Axios";

const UserCard = ({ user, searchQuery, selectedByOptions, timeSlots }) => {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(""); // Stores a single company
    const [selectedTime, setSelectedTime] = useState("");

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
        setSelectedCompany(company); // Store only one company
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTime || !selectedCompany) {
            alert("Please select a company and a time slot.");
            return;
        }

        try {
            const data = {
                userId: user._id, // Ensure correct user ID is sent
                slotTime: selectedTime, // Selected time slot
                company: selectedCompany, // Selected company
            };

            const response = await Axios.post(`/booking-slot/${user._id}`, data, {
                headers: { "Content-Type": "application/json" }
            });
            console.log("Booking submitted successfully:", response.data);

            alert("Slot booked successfully!");
            setShowBookingForm(false);
        } catch (error) {
            console.error("Error booking slot:", error.response?.data || error.message);
            alert("Failed to book slot. Please try again.");
        }
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
                    </div>
                </div>
                <button
                    onClick={() => setShowBookingForm(!showBookingForm)}
                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
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
                                    <span>{company}</span>
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
                                <option key={time} value={time}>
                                    {time}
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
