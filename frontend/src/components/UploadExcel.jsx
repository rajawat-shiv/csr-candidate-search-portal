import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function UploadExcel({
  setLastUpload,
  fetchStats,
}) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select Excel file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://csr-candidate-backend.onrender.com/api/candidates/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },

          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );

            setProgress(percent);
          },
        }
      );

      toast.success(`${res.data.message} ✅`);

      const uploadTime =
        new Date().toLocaleString("en-IN");

      localStorage.setItem(
        "lastUpload",
        uploadTime
      );

      setLastUpload(uploadTime);
      fetchStats();

      setLastUpload(
        new Date().toLocaleString("en-IN")
      );
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
        setLoading(false);
      }, 1000);

      setFile(null);
    } catch (error) {
      console.log(error);
      toast.error("Upload Failed");
    } finally {

    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

      <div className="flex items-center justify-between mb-4">

        <div>
          <h2 className="text-2xl font-bold">
            📁 Upload Master Excel
          </h2>

          <p className="text-gray-500 text-sm">
            Upload latest CSR master file
          </p>
        </div>

        {file && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            File Selected
          </span>
        )}
      </div>

      <div className="flex gap-4 items-center">

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="flex-1 border border-slate-300 rounded-xl p-3"
        />

        <button
          onClick={uploadFile}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white font-semibold transition ${loading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">

              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>

              Uploading {progress}%

            </div>
          ) : (
            "Upload"
          )}
        </button>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs whitespace-nowrap ml-3">
          🔒 Admin Only
        </span>
      </div>

      {file && (
        <div className="mt-4 bg-slate-50 border rounded-xl p-3">
          <p className="text-sm">
            Selected File:
          </p>

          <p className="font-medium">
            {file.name}
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-4">

          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">

            <div
              className="bg-blue-600 h-3 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="text-sm text-center mt-2 text-blue-600 font-medium">
            Uploading... {progress}%
          </p>

        </div>
      )}

    </div>
  );
}


export default UploadExcel;