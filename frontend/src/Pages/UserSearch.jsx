import React, { useState, useEffect } from "react";
import axios from "axios";

function UserSearch() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await axios.get(`/api/users?search=${query}`);
            setUsers(data);
        };
        fetchUsers();
    }, [query]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search user..."
                onChange={(e) => setQuery(e.target.value)}
            />
            <ul>
                {users.map((user) => (
                    <li key={user._id}>{user.firstName} {user.lastName}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserSearch;
