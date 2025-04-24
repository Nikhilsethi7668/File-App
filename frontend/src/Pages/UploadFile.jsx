import React, { useState, useEffect, useContext } from "react";
import UserCard from "../Components/UserCard";
import UserContext from "../Context/UserContext";
import SlotsContext from "../Context/SlotsContext";
import DataContext from "../Context/DataContext";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { fileUserData, setFileUserData } = useContext(DataContext);
  const { slots, setSlots, fetchSlots } = useContext(SlotsContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await fetch("https://file-app-api.amiigo.in/api/files/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      alert("File uploaded successfully!");
      await fetchData();
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await fetch("http://localhost:4000/api/files/get-filedata");
      if (!response.ok) throw new Error("Failed to fetch data");

      const jsonData = await response.json();
      setFileUserData(jsonData.users || []); // Ensure this sets the context state
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data: " + error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync userData with data state when userData updates (for live updates)
  useEffect(() => {
    if (fileUserData && Array.isArray(fileUserData)) {
      setData(fileUserData);
    }
  }, [fileUserData]);

  // Log userData when it changes
  useEffect(() => {
    console.log("User data updated in FileUpload:", fileUserData);
  }, [fileUserData]);

  // Filter data based on search query & Sort by the highest number of companies in `selectedBy`
  const filteredData = (data || [])
    .filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => (b.selectedBy?.length || 0) - (a.selectedBy?.length || 0));

  // Generate time slots from 10:00 to 17:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour !== 17) slots.push(`${hour}:30`);
    }
    return slots;
  };

  // Get unique selectedBy options from all users
  const getSelectedByOptions = () => {
    const allOptions = (data || []).flatMap((user) => user.selectedBy || []);
    return [...new Set(allOptions)];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Conference Room Booking System</h1>

      {/* Upload Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8 shadow-sm">
        <div className="flex gap-4 mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="flex-1 border p-2 rounded"
            accept=".xlsx,.xls"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Uploading..." : "Upload Attendees"}
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Upload an Excel file with attendee information (.xlsx or .xls format)
        </p>
      </div>

      {/* Search and Data Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search attendees by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Data Display */}
      {fetching ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendee data...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-red-500">
            {data.length === 0
              ? "No data available. Please upload an attendee file."
              : "No attendees match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredData.map((user, index) => (
            <UserCard
              key={user._id || index}
              user={user}
              searchQuery={searchQuery}
              selectedByOptions={getSelectedByOptions()}
              timeSlots={generateTimeSlots()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
