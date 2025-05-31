import React, { useEffect, useState } from "react";
import Select from "react-select";
import Axios from "../Api/Axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [assignedTo, setAssignedTo] = useState([]); // Changed to array for multi-select
    const [slotGap, setSlotGap] = useState(""); // Added slotGap state
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        Axios.post("/auth/users-list")
            .then(res => {
                console.log("Users List Response:", res.data);
                setUsers(res.data.users || []);
            })
            .catch((err) => {
                console.error("Users List Error:", err);
                setUsers([]);
            });
    }, []);

    // Transform users data for react-select
    const userOptions = users.map(user => ({
        value: user._id,
        label: `${user.username} (${user.email})`
    }));

    // Slot gap options
    const slotGapOptions = [
        { value: 15, label: '15 min' },
        { value: 20, label: '20 min' },
        { value: 30, label: '30 min' }
    ];

    // Handle multi-select change
    const handleAssignedToChange = (selectedOptions) => {
        setAssignedTo(selectedOptions || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!title || assignedTo.length === 0 || !currentUserId) {
            setError("Title, Assigned To, and Created By are required.");
            setLoading(false);
            return;
        }

        try {
            // Extract user IDs from selected options
            const assignedUserIds = assignedTo.map(option => option.value);
            
            await Axios.post("/events", {
                title,
                image,
                description,
                startDate,
                endDate,
                assignedTo: assignedUserIds, // Send array of user IDs
                slotGap: parseInt(slotGap), // Send slot gap as number
                createdBy: currentUserId,
            });
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Custom styles for react-select to match your design
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            padding: '0.125rem',
            boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
            borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#d1d5db'
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#eff6ff',
            borderRadius: '0.25rem'
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#1e40af'
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#1e40af',
            '&:hover': {
                backgroundColor: '#dbeafe',
                color: '#1e40af'
            }
        })
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow">
                {error && <div className="text-red-500">{error}</div>}
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Image URL</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={image}
                        onChange={e => setImage(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        className="w-full border rounded px-3 py-2"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-medium mb-1">Start Date</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded px-3 py-2"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-medium mb-1">End Date</label>
                        <input
                            type="datetime-local"
                            className="w-full border rounded px-3 py-2"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-1">Assign To</label>
                    <Select
                        isMulti
                        value={assignedTo}
                        onChange={handleAssignedToChange}
                        options={userOptions}
                        styles={customStyles}
                        placeholder="Select users..."
                        noOptionsMessage={() => "No users found"}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        isSearchable={true}
                        isClearable={true}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Slot Gap</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={slotGap}
                        onChange={e => setSlotGap(e.target.value)}
                    >
                        <option value="">Select Slot Gap</option>
                        {slotGapOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;