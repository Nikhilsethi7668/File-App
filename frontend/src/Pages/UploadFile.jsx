import React ,{ useState, useEffect } from "react";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      await axios.post("http://localhost:5000/api/files/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully!");
      fetchData();
    } catch (error) {
      console.error("Upload error:", error.response ? error.response.data : error.message);
      alert("File upload failed: " + (error.response ? error.response.data.error : error.message));
    }
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/files/get-filedata");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} className="mb-4 border p-2 w-full" />
      <button onClick={handleUpload} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? "Uploading..." : "Upload"}
      </button>

      <h2 className="text-lg font-bold mt-6">Uploaded Data</h2>
      <table className="w-full border-collapse border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Sr. No</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Company</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{user.serialNo}</td>
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.lastName}</td>
              <td className="border p-2">{user.company}</td>
              <td className="border p-2">{user.title}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
