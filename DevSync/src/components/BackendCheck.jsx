import React, { useState } from "react";
import { api } from "../utils/api";

const BackendCheck = () => {
  const [status, setStatus] = useState("Not checked");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const checkBackend = async () => {
    setError("");
    setProjects([]);
    setStatus("Checking...");
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
      setStatus("Success");
    } catch (err) {
      setStatus("Error");
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ margin: '1em 0', padding: '1em', border: '1px solid #ccc', borderRadius: 8, background: '#18181b', color: '#fff' }}>
      <button style={{ padding: '0.5em 1em', borderRadius: 4, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }} onClick={checkBackend}>Check Backend Connection</button>
      <div style={{ marginTop: '0.5em' }}>
        {status === "Checking..." && <span>Checking backend...</span>}
        {status === "Success" && (
          <div>
            <strong>Backend is connected!</strong>
            <div style={{ marginTop: '0.5em' }}>
              <strong>Projects:</strong>
              {projects.length === 0 ? (
                <div>No projects found.</div>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {projects.map((p) => (
                    <li key={p._id} style={{ margin: '0.5em 0', padding: '0.5em', background: '#27272a', borderRadius: 4 }}>
                      <div><strong>{p.title}</strong></div>
                      <div style={{ fontSize: '0.9em', color: '#a1a1aa' }}>{p.description}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {status === "Error" && <span style={{ color: '#f87171' }}>Error: {error}</span>}
      </div>
    </div>
  );
};

export default BackendCheck;
