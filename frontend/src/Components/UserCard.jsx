import React, { useState, useEffect, useContext } from "react";
import Axios from "../Api/Axios";
import { CiClock2, CiCalendar, CiUser, CiMail, CiPhone } from "react-icons/ci";
import { FiBriefcase, FiTag, FiX, FiCheck } from "react-icons/fi";
import SlotsContext from "../Context/SlotsContext.jsx";

const UserCard = ({eventId, user: initialUser, searchQuery, selectedByOptions, timeSlots = [] }) => {
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
                event:eventId
            };

            const response = await Axios.post(`/booking-slot`, data, {
                headers: { "Content-Type": "application/json" }
            });
            await fetchSlots(eventId);
            alert(response.data.message);
            setShowBookingForm(false);
        } catch (error) {
            console.error("Error booking slot:", error);
            alert(error.response?.data?.message || "An error occurred while booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(()=>{
        if(eventId){
        fetchSlots(eventId); 
        }
    },[eventId])

    // Filter slots for the current user
    const userBookedSlots = slots.filter(slot => slot.userId === user._id);

    // Check if a time slot is booked
  const isTimeSlotBooked = (time) => {
    return slots.some(slot => slot.timeSlot === time);
};

    // Calculate available slots
    const availableSlots = timeSlots.length - userBookedSlots.length;

    return (
        <div className="border border-gray-200 rounded-xl w-full p-4 md:p-6 mb-6 shadow-sm bg-white transition-all duration-200 hover:shadow-lg group">
            <div className="flex flex-col gap-4 md:gap-6">
                {/* User Info Section */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 break-words">
                                {highlightMatch(user.firstName)} {highlightMatch(user.lastName)}
                            </h3>
                            <div className="flex items-start text-gray-600 mt-2">
                                <FiBriefcase className="mr-2 mt-0.5 text-base md:text-lg opacity-70 flex-shrink-0" />
                                <span className="text-sm md:text-base break-words">
                                    {highlightMatch(user.title)} at {highlightMatch(user.company)}
                                </span>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowBookingForm(!showBookingForm)}
                            className={`flex-shrink-0 px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                                userBookedSlots.length >= timeSlots.length
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            } flex items-center gap-1 md:gap-2 whitespace-nowrap`}
                            disabled={userBookedSlots.length >= timeSlots.length}
                        >
                            <CiCalendar className="text-base md:text-lg flex-shrink-0" />
                            <span className="hidden sm:inline">{showBookingForm ? "Close" : "Book Slot"}</span>
                            <span className="sm:hidden">{showBookingForm ? "Close" : "Book"}</span>
                            {availableSlots > 0 && (
                                <span className="bg-blue-100 text-blue-800 text-[10px] md:text-xs px-1.5 md:px-2 py-1 rounded-full flex-shrink-0">
                                    {availableSlots} left
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex items-start text-gray-700">
                            <CiMail className="mr-2 md:mr-3 mt-0.5 text-base md:text-lg opacity-70 flex-shrink-0" />
                            <span className="text-sm md:text-base break-all">{highlightMatch(user.email)}</span>
                        </div>
                        <div className="flex items-start text-gray-700">
                            <CiPhone className="mr-2 md:mr-3 mt-0.5 text-base md:text-lg opacity-70 flex-shrink-0" />
                            <span className="text-sm md:text-base">{highlightMatch(user.phone)}</span>
                        </div>
                        {user.selectedBy?.length > 0 && (
                            <div className="flex items-start text-gray-700">
                                <FiTag className="mr-2 md:mr-3 mt-1 text-base md:text-lg opacity-70 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <span className="font-medium text-sm md:text-base">Selected by:</span>
                                    <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                                        {user.selectedBy.map((company, index) => (
                                            <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs md:text-sm break-words">
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
                        <div className="mt-6 p-3 md:p-4 border border-gray-100 rounded-lg bg-gray-50">
                            <div className="flex items-center text-gray-800 font-medium">
                                <CiClock2 className="mr-2 text-lg md:text-xl flex-shrink-0" />
                                <span className="text-sm md:text-base">Booked Meetings</span>
                            </div>
                            <ul className="mt-3 space-y-2">
                                {userBookedSlots.map((slot, index) => (
                                    <li key={index} className="flex items-center justify-between bg-white p-2 md:p-3 rounded-lg shadow-xs gap-2">
                                        <div className="flex items-center min-w-0 flex-1">
                                            <span className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-[10px] md:text-xs font-medium mr-2 md:mr-3 flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="font-medium text-sm md:text-base">{slot.timeSlot}</span>
                                        </div>
                                        <span className="bg-green-50 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex-shrink-0 max-w-[120px] md:max-w-none truncate">
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
                    <div className="w-full border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            <h4 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                                <CiCalendar className="text-lg md:text-xl" />
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
                                            className={`flex items-center p-2 md:p-3 rounded-lg cursor-pointer transition-all ${
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
                                                className="form-radio h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500 flex-shrink-0"
                                            />
                                            <span className="ml-3 text-sm md:text-base text-gray-700 break-words min-w-0 flex-1">{company}</span>
                                            {selectedCompany === company && (
                                                <FiCheck className="ml-2 text-green-500 flex-shrink-0" />
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            type="button"
                                            key={time}
                                            onClick={() => !isTimeSlotBooked(time) && setSelectedTime(time)}
                                            className={`p-2 md:p-3 rounded-lg text-center transition-all text-sm md:text-base ${
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
                                                <span className="block text-[10px] md:text-xs text-red-500 mt-1">
                                                    Booked
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowBookingForm(false);
                                        setSelectedCompany("");
                                        setSelectedTime("");
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedCompany || !selectedTime}
                                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition-colors flex items-center justify-center gap-2 text-sm md:text-base ${
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
                                            <span className="hidden sm:inline">Processing...</span>
                                            <span className="sm:hidden">Wait...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiCheck className="flex-shrink-0" />
                                            <span className="hidden sm:inline">Confirm Booking</span>
                                            <span className="sm:hidden">Confirm</span>
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