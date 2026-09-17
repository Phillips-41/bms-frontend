import { useEffect, useState } from "react";
import axios from "axios";
import { getFile } from "../../../../services/apiService";

function DocumentViewer({ documentId, filename }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFile(documentId);
        const blob = new Blob([response.data]);
        objectUrl = URL.createObjectURL(blob);
        setFileUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load file", err);
        setError("Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [documentId]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          background: "#fafafa",
          color: "#6b7280",
          fontSize: "13px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "15px",
          border: "1px solid #fecaca",
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: "13px",
        }}
      >
        {error}
      </div>
    );
  }

  if (!fileUrl) {
    return null;
  }

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(filename);
  const isPdf = /\.pdf$/i.test(filename);

  // Image
  if (isImage) {
    return (
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div
          style={{
            height: "160px",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={fileUrl}
            alt={filename}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{ padding: "11px 12px" }}>
          <div
            title={filename}
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#374151",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "8px",
            }}
          >
            {filename}
          </div>
          <a
            href={fileUrl}
            download={filename}
            style={{
              fontSize: "12px",
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  // PDF
  if (isPdf) {
    return (
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "16px",
          background: "#fff",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              flexShrink: 0,
            }}
          >
            PDF
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={filename}
            >
              {filename}
            </div>
            <div
              style={{
                marginTop: "3px",
                fontSize: "11px",
                color: "#9ca3af",
              }}
            >
              PDF Document
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "14px",
          }}
        >
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "7px 10px",
              borderRadius: "6px",
              border: "1px solid #dbeafe",
              background: "#eff6ff",
              color: "#2563eb",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            View
          </a>
          <a
            href={fileUrl}
            download={filename}
            style={{
              flex: 1,
              padding: "7px 10px",
              borderRadius: "6px",
              background: "#f3f4f6",
              color: "#374151",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  // Other files
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "20px" }}>📄</span>
        <span
          title={filename}
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#374151",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {filename}
        </span>
      </div>

      <a
        href={fileUrl}
        download={filename}
        style={{
          display: "block",
          padding: "7px 10px",
          borderRadius: "6px",
          background: "#f3f4f6",
          color: "#374151",
          textAlign: "center",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        Download
      </a>
    </div>
  );
}

export default DocumentViewer;
