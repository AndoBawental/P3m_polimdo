  // src/components/Files/FileUpload.js

  import React, { useState } from 'react';

  const FileUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
      setFile(e.target.files[0]);
      setError(null);
    };

    const handleUpload = async () => {
      if (!file) {
        setError('Pilih file terlebih dahulu');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        // Simulasi upload, ganti dengan logic upload ke server
        // Contoh:
        // const formData = new FormData();
        // formData.append('file', file);
        // await api.uploadFile(formData);

        // Trigger callback agar parent refresh file list
        onUpload && onUpload(file);

        alert('Upload berhasil!');
        setFile(null);
      } catch (err) {
        setError('Upload gagal, coba lagi');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="border p-4 rounded shadow-sm max-w-md">
        <input type="file" onChange={handleChange} />
        {file && <p>File: {file.name}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {uploading ? 'Mengunggah...' : 'Upload'}
        </button>
      </div>
    );
  };

  export default FileUpload;
