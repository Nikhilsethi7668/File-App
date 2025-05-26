import React, { useEffect, useState } from "react";
import Axios from "../Api/Axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!title || !assignedTo || !currentUserId) {
            setError("Title, Assigned To, and Created By are required.");
            setLoading(false);
            return;
        }

        try {
            await Axios.post("/events", {
                title,
                image,
                description,
                startDate,
                endDate,
                assignedTo,
                createdBy: currentUserId,
            });
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-medium mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-1">Assign To</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={assignedTo}
                        onChange={e => setAssignedTo(e.target.value)}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.username} ({user.email})
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