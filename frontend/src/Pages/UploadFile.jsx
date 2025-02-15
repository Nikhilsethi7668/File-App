import React, { useState, useEffect, useContext } from "react";
import UserCard from "../Components/UserCard";
import UserContext from "../Context/UserContext";
import SlotsContext from "../Context/SlotsContext";
import { DataContext } from "../Context/DataContext";

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
      const response = await fetch("http://localhost:4000/api/files/upload-file", {
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
      setFileUserData(jsonData.users || []);
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

  useEffect(() => {
    if (fileUserData && Array.isArray(fileUserData)) {
      setData(fileUserData);
    }
  }, [fileUserData]);

  useEffect(() => {
    console.log("User data updated in FileUpload:", fileUserData);
  }, [fileUserData]);

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

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">Conference Room Booking System</h1>

      {/* Upload Section */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded w-full sm:w-auto"
            accept=".xlsx,.xls"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300 transition-colors w-full sm:w-auto"
          >
            {loading ? "Uploading..." : "Upload Attendees"}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center sm:text-left">
          Upload an Excel file with attendee information (.xlsx or .xls format)
        </p>
      </div>

      {/* Search Section */}
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
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading attendee data...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-red-500">
            {data.length === 0 ? "No data available. Please upload an attendee file." : "No attendees match your search."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((user, index) => (
            <UserCard key={user._id || index} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
