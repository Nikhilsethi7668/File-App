import React, { useState, useEffect, useContext } from "react";
import Axios from "../Api/Axios";
import { CiClock2, CiCalendar, CiUser, CiMail, CiPhone } from "react-icons/ci";
import { FiBriefcase, FiTag, FiX, FiCheck } from "react-icons/fi";
import SlotsContext from "../Context/SlotsContext.jsx";

const UserCard = ({ user: initialUser, searchQuery, selectedByOptions, timeSlots = [] }) => {
    const [user, setUser] = useState(initialUser);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const { slots, fetchSlots } = useContext(SlotsContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    // Highlight matching text in search results
    const highlightMatch = (text) => {
        if (!searchQuery || !text) return text;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        return text.toString().split(regex).map((part, i) =>
            i % 2 === 1 ? (
                <mark key={i} className="bg-yellow-100 text-yellow-800 px-1 rounded">{part}</mark>
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
        setIsSubmitting(true);

        if (!selectedTime || !selectedCompany) {
            alert("Please select a company and a time slot.");
            setIsSubmitting(false);
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
            await fetchSlots();
            alert(response.data.message);
            setShowBookingForm(false);
        } catch (error) {
            console.error("Error booking slot:", error);
            alert(error.response?.data?.message || "An error occurred while booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter slots for the current user
    const userBookedSlots = slots.filter(slot => slot.userId === user._id);

    // Check if a time slot is booked
    const isTimeSlotBooked = (time) => {
        return userBookedSlots.some(slot => slot.timeSlot === time);
    };

    // Calculate available slots
    const availableSlots = timeSlots.length - userBookedSlots.length;

    return (
        <div className="border border-gray-200 rounded-xl md:w-auto w-[90vw] p-6 mb-6 shadow-sm bg-white transition-all duration-200 hover:shadow-lg group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* User Info Section */}
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {highlightMatch(user.firstName)} {highlightMatch(user.lastName)}
                            </h3>
                            <div className="flex items-center text-gray-600 mt-1">
                                <FiBriefcase className="mr-2 opacity-70" />
                                <span>{highlightMatch(user.title)} at {highlightMatch(user.company)}</span>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowBookingForm(!showBookingForm)}
                            className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                userBookedSlots.length >= timeSlots.length
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            } flex items-center gap-2`}
                            disabled={userBookedSlots.length >= timeSlots.length}
                        >
                            <CiCalendar className="text-lg" />
                            {showBookingForm ? "Close" : "Book Slot"}
                            {availableSlots > 0 && (
                                <span className="bg-blue-100 text-blue-800 text-[10px] md:text-xs px-2 py-1 rounded-full">
                                    {availableSlots} left
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-center text-gray-700">
                            <CiMail className="mr-3 text-lg opacity-70" />
                            <span>{highlightMatch(user.email)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <CiPhone className="mr-3 text-lg opacity-70" />
                            <span>{highlightMatch(user.phone)}</span>
                        </div>
                        {user.selectedBy?.length > 0 && (
                            <div className="flex items-start text-gray-700">
                                <FiTag className="mr-3 mt-1 text-lg opacity-70" />
                                <div>
                                    <span className="font-medium">Selected by:</span>{" "}
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {user.selectedBy.map((company, index) => (
                                            <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                                                {highlightMatch(company)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booked Slots */}
                    {userBookedSlots.length > 0 && (
                        <div className="mt-6 p-4 border border-gray-100 rounded-lg bg-gray-50">
                            <div className="flex items-center text-gray-800 font-medium">
                                <CiClock2 className="mr-2 text-xl" />
                                <span>Booked Meetings</span>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {userBookedSlots.map((slot, index) => (
                                    <li key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-xs">
                                        <div className="flex items-center">
                                            <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium">{slot.timeSlot}</span>
                                        </div>
                                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                            {slot.company}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Booking Form */}
                {showBookingForm && (
                    <div className="md:w-96 border-l border-gray-100 md:pl-6 md:ml-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <CiCalendar />
                                Schedule Meeting
                            </h4>

                            {/* Company Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Company
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {selectedByOptions.map((company) => (
                                        <label
                                            key={company}
                                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                                                selectedCompany === company
                                                    ? "bg-blue-50 border border-blue-200"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="company"
                                                value={company}
                                                checked={selectedCompany === company}
                                                onChange={() => handleCompanyChange(company)}
                                                className="form-radio h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 text-gray-700">{company}</span>
                                            {selectedCompany === company && (
                                                <FiCheck className="ml-auto text-green-500" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Available Time Slots
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            type="button"
                                            key={time}
                                            onClick={() => !isTimeSlotBooked(time) && setSelectedTime(time)}
                                            className={`p-2 rounded-lg text-center transition-all ${
                                                isTimeSlotBooked(time)
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : selectedTime === time
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                                            }`}
                                            disabled={isTimeSlotBooked(time)}
                                        >
                                            {time}
                                            {isTimeSlotBooked(time) && (
                                                <span className="block text-xs text-red-500">
                                                    Booked
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBookingForm(false);
                                        setSelectedCompany("");
                                        setSelectedTime("");
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedCompany || !selectedTime}
                                    className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                                        isSubmitting || !selectedCompany || !selectedTime
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheck />
                                            Confirm Booking
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCard;