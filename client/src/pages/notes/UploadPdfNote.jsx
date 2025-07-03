import { useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UploadPdfNote() {
  const [pdfFile, setPdfFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("subject", subject);
    formData.append("tags", tags); // comma-separated tags

    try {
      const res = await apiRequest({
        method: endpoints.uploadPdf.method,
        url: endpoints.uploadPdf.url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
        
      toast.success("PDF uploaded successfully!");
      navigate("/notes");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl shadow-lg border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload PDF Note</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1">PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. waves, motion"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
          >
            Upload PDF
          </button>
        </form>
      </div>
    </div>
  );
}
