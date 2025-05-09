import React, { useState, useEffect, useContext } from "react";
import UserCard from "../Components/UserCard";
import DataContext from "../Context/DataContext";
import Axios from "../Api/Axios";
import { FiUpload, FiSearch, FiUsers, FiClock, FiDelete } from "react-icons/fi";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { fileUserData,isLoading,refetch } = useContext(DataContext);
  // const { slots, setSlots, fetchSlots } = useContext(SlotsContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file); // Make sure this matches your backend's expected field name
    setLoading(true);
  
    try {
      const response = await Axios.post("/files/upload-file", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      alert("File uploaded successfully!");
      // If you need to refresh data after upload:
      // await fetchData(); 
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed: " + 
        (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
      refetch()
      setFile(null);
    }
  };

  const deleteData = async () => {
    try {
      const response = await Axios.delete("/files/delete-filedata");
      if (!response.status > 300) throw new Error("Failed to delete data");
      refetch()
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // const fetchData = async () => {
  //   setFetching(true);
  //   try {
  //     const response = await Axios.get("/files/get-filedata");
  //     if (!response.status > 300) throw new Error("Failed to fetch data");

  //     setFileUserData(response.data.users || []);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setFetching(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (fileUserData && Array.isArray(fileUserData)) {
      setData(fileUserData);
    }
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

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour !== 17) slots.push(`${hour}:30`);
    }
    return slots;
  };

  const getSelectedByOptions = () => {
    const allOptions = (data || []).flatMap((user) => user.selectedBy || []);
    return [...new Set(allOptions)];
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Conference Room Booking System
          </h1>
          <p className="text-gray-600 mt-1">
            Manage attendee schedules and meeting slots
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
          <FiUsers className="text-blue-500" />
          <span className="font-medium text-blue-800">
            {data.length} attendees
          </span>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
              <div className="bg-blue-100 p-2 rounded-full">
                <FiUpload className="text-blue-500" />
              </div>
              <div className="flex-1">
                {file ? (
                  <p className="font-medium text-gray-800 truncate">
                    {file.name}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    <span className="text-blue-500 font-medium">
                      Click to browse
                    </span>{" "}
                    or drag and drop Excel file
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supports .xlsx or .xls files
                </p>
              </div>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx,.xls"
            />
          </label>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              loading || !file
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FiUpload />
                Upload Attendees
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search and Data Section */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search attendees by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FiClock className="text-blue-500" />
          <span>
            Showing {filteredData.length} of {data.length} attendees
          </span>
        </div>
       <div className="flex gap-2">
       {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-blue-500 hover:text-blue-700"
          >
            Clear search
          </button>
        )}
        <button onClick={deleteData} className="bg-red-700 text-white whitespace-nowrap rounded-xl flex gap-2 items-center hover:bg-red-500 p-2">
          <FiDelete/> Delete
        </button>
       </div>
      </div>

      {/* Data Display */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendee data...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiUsers className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {data.length === 0
              ? "No attendee data available"
              : "No matching attendees"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {data.length === 0
              ? "Please upload an Excel file with attendee information to get started."
              : `No attendees found for "${searchQuery}". Try a different search term.`}
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