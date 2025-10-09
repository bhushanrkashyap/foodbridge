import React, { useState } from "react";
import axios from "axios";

// --- For better organization, styles are defined here ---
const styles = {
  container: {
    padding: '24px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    fontFamily: 'sans-serif',
  },
  title: {
    marginBottom: '16px',
    color: '#333',
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', // Provides spacing between items
  },
  inputLabel: {
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-block',
  },
  hiddenInput: {
    display: 'none',
  },
  fileName: {
    color: '#555',
    fontStyle: 'italic',
  },
  analyzeButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#28a745', // A nice green color
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9e9e9e',
    cursor: 'not-allowed',
  },
  resultsContainer: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #d6e9c6',
    borderRadius: '4px',
    backgroundColor: '#dff0d8',
    color: '#3c763d',
  }
};

const PhotoUpload = ({ photos = [], onPhotosChange, maxPhotos = 5, onAnalysisChange }) => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
      // Clear analysis when new file is selected
      if (onAnalysisChange) {
        onAnalysisChange(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:5001/analyze", formData);
      // Check if the response from the backend contains an error
      if (res.data.error) {
        console.warn("Backend returned error:", res.data.error);
        // Still show demo analysis if it's provided
        if (res.data.food_type) {
          setAnalysis(res.data);
          // Pass analysis to parent component
          if (onAnalysisChange) {
            onAnalysisChange(res.data);
          }
        } else {
          setAnalysis(null);
          if (onAnalysisChange) {
            onAnalysisChange(null);
          }
        }
      } else {
        setAnalysis(res.data);
        // Pass analysis to parent component
        if (onAnalysisChange) {
          onAnalysisChange(res.data);
        }
      }
    } catch (err) {
      console.error("Error during analysis:", err);
      
      // Provide demo analysis when backend is not available
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        console.log("Backend not available, providing demo analysis");
        const demoAnalysis = {
          food_type: "Demo Food Item",
          freshness: "Fresh", 
          advice: "Demo analysis - Backend server is not running. Start the backend to enable AI analysis."
        };
        setAnalysis(demoAnalysis);
        if (onAnalysisChange) {
          onAnalysisChange(demoAnalysis);
        }
      } else {
        alert("Error analyzing the image. Please try a different image or check the console.");
        setAnalysis(null);
        if (onAnalysisChange) {
          onAnalysisChange(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Analyze Food Freshness</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <label htmlFor="file-upload" style={styles.inputLabel}>
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.hiddenInput}
          />
          <span style={styles.fileName}>
            {file ? file.name : "No file selected"}
          </span>
          {file && (
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.analyzeButton,
                ...(loading ? styles.analyzeButtonDisabled : {}),
              }}
            >
              {loading ? "Analyzing..." : "Analyze Freshness"}
            </button>
          )}
        </div>
      </form>

      {analysis && (
        <div style={{
          ...styles.resultsContainer,
          ...(analysis.freshness?.toLowerCase().includes('expired') ? {
            backgroundColor: '#fee',
            border: '2px solid #f44336',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
          } : {
            backgroundColor: '#e8f5e8',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px'
          })
        }}>
          {analysis.freshness?.toLowerCase().includes('expired') && (
            <div style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              ⚠️ This food item is expired and cannot be posted.
            </div>
          )}
          <p><strong>Food Type:</strong> {analysis.food_type}</p>
          <p><strong>Freshness:</strong> <span style={{
            color: analysis.freshness?.toLowerCase().includes('expired') ? '#f44336' : '#4caf50',
            fontWeight: 'bold'
          }}>{analysis.freshness}</span></p>
          <p><strong>Advice:</strong> {analysis.advice}</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;