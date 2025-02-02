import React, { useState, useEffect } from "react";
import Axios from "../Api/Axios";
import { uploadFile } from "../Api/Api";



const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  useEffect(() => {
    console.log(data);
  }, [data])

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      //upload file 
      // const response = await fetch("http://localhost:4000/api/files/upload-file", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || "Upload failed");
      // }

      alert("File uploaded successfully!");

      // get data
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
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      console.log(response)
      const jsonData = await response.json();
      console.log("json data is", jsonData)
      setData(jsonData.users || []); // Ensure users exist
      console.log(jsonData)
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

  const formatSelectedBy = (selectedBy) => {
    return selectedBy.length > 0 ? selectedBy.join(", ") : "N/A";
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          className="flex-1 border p-2 rounded"
          accept=".xlsx,.xls"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:bg-blue-300"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {fetching ? (
        <p className="text-gray-500">Loading data...</p>
      ) : data.length === 0 ? (
        <p className="text-red-500">No data available. Upload a file to display records.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Sr. No</th>
                <th className="border p-2 text-left">First Name</th>
                <th className="border p-2 text-left">Last Name</th>
                <th className="border p-2 text-left">Company</th>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Selected By</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{user.serialNo}</td>
                  <td className="border p-2">{user.firstName}</td>
                  <td className="border p-2">{user.lastName}</td>
                  <td className="border p-2">{user.company}</td>
                  <td className="border p-2">{user.title}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{formatSelectedBy(user.selectedBy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
