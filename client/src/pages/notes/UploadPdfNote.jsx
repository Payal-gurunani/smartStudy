import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";

export default function UploadPdfNote() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    const finalSubject = subject === "Other" ? customSubject : subject;

    if (!finalSubject) {
      toast.error("Please enter a subject.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("subject", finalSubject);

    try {
      await apiRequest({
        method: endpoints.uploadPdf.method,
        url: endpoints.uploadPdf.url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      toast.success("PDF uploaded successfully!");
      navigate("/notes/view");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload PDF.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-6 py-10 w-full">
        {/* Mobile Top */}
        <div className="sm:hidden mb-6 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu className="text-2xl text-white" />
          </button>
          <h2 className="text-lg font-semibold">Upload PDF</h2>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <h1 className="text-3xl font-bold mb-4">📤 Upload PDF Documents</h1>
          <p className="text-sm text-gray-400 mb-6">
            Drag and drop your PDF file or click to browse. Only PDFs are accepted. Max file size: 20MB.
          </p>

          {/* Drop Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition ${
              isDragActive ? "border-emerald-400 bg-gray-700" : "border-gray-600"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-200 mb-2">Drag and drop files here</p>
            <p className="text-gray-500 text-sm">Or click to browse</p>
            <button className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">
              Select Files
            </button>
            {pdfFile && (
              <div className="mt-4 text-sm text-gray-300 font-medium">
                Selected File: {pdfFile.name}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-300">Upload Progress</label>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
            </div>
          )}

          {/* Subject Dropdown */}
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium text-gray-300">Select Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-600 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Subject</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Math">Math</option>
              <option value="Biology">Biology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Custom Subject Input */}
          {subject === "Other" && (
            <div className="mt-4">
              <label className="block mb-1 text-sm font-medium text-gray-300">Enter Custom Subject</label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Environmental Science"
                className="w-full bg-gray-700 text-white border border-gray-600 px-4 py-2 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Submit */}
          <div className="mt-8 text-right">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Upload
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
