import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("/api/files/upload", formData);
            alert("File uploaded successfully");
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default FileUpload;
