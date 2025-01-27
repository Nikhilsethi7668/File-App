import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        const fetchInsights = async () => {
            const { data } = await axios.get("/api/insights"); // API for insights
            setInsights(data);
        };
        fetchInsights();
    }, []);

    if (!insights) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Dashboard</h2>
            <div>Total Users: {insights.totalUsers}</div>
            <div>Company-wise Selections:</div>
            <ul>
                {insights.companyWiseSelections.map((company) => (
                    <li key={company.name}>
                        {company.name}: {company.count} users
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;
