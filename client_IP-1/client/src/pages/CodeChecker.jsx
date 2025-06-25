import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function CodeChecker() {
  const [requirements, setRequirements] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null); // To store the AI's checklist response

  // Styling based on the provided palette
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0d1117", // Very dark gray/black background
      padding: "20px",
      fontFamily: "Roboto, sans-serif",
      color: "#f0f6fc", // Light gray/white text
    },
    header: {
      color: "#58a6ff", // Blue accent for headers
      fontFamily: "Cascadia Code, monospace",
      marginBottom: "30px",
      textAlign: "center",
    },
    textarea: {
      backgroundColor: "#161b22", // Medium gray for secondary backgrounds
      color: "#f0f6fc", // Light gray/white for text
      border: "1px solid #30363d", // Medium gray border
      borderRadius: "8px",
      padding: "15px",
      resize: "vertical", // Allow vertical resizing
      minHeight: "200px", // Minimum height
      fontFamily: "Roboto, sans-serif",
      fontSize: "0.95rem",
    },
    buttonPrimary: {
      backgroundColor: "#58a6ff", // Blue accent
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
      cursor: "pointer",
    },
    buttonClear: {
      backgroundColor: "#30363d", // Medium gray
      color: "#e6edf3",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
      cursor: "pointer",
    },
    buttonHoverPrimary: {
      backgroundColor: "#1f6feb", // Darker blue on hover
    },
    buttonHoverClear: {
      backgroundColor: "#21262d", // Darker gray on hover
    },
    resultCard: {
      backgroundColor: "#161b22",
      border: "1px solid #30363d",
      borderRadius: "8px",
      padding: "20px",
      marginTop: "30px",
      color: "#f0f6fc",
    },
    resultHeader: {
      color: "#58a6ff",
      fontFamily: "Cascadia Code, monospace",
      marginBottom: "15px",
      fontSize: "1.5rem",
    },
    summaryText: {
      fontSize: "1.1rem",
      marginBottom: "20px",
      lineHeight: "1.6",
    },
    checklistTitle: {
      color: "#f0f6fc",
      fontSize: "1.2rem",
      marginBottom: "10px",
      fontWeight: "bold",
    },
    checklistItem: {
      backgroundColor: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "5px",
      padding: "10px 15px",
      marginBottom: "10px",
      display: "flex",
      flexDirection: "column", // Stack description and details
      gap: "5px",
    },
    checklistItemDescription: {
      fontSize: "1rem",
      fontWeight: "bold",
    },
    checklistItemDetails: {
      fontSize: "0.9rem",
      color: "#e6edf3",
    },
    checklistItemStatus: {
      fontSize: "0.9rem",
      fontWeight: "bold",
    },
    statusCompleted: {
      color: "#238636", // Green for success
    },
    statusIncomplete: {
      color: "#dc4c3e", // Todoist red for error/incomplete
    },
    errorText: {
      color: "#dc4c3e",
      textAlign: "center",
      marginTop: "20px",
      fontSize: "1.1rem",
    },
    loadingText: {
      color: "#58a6ff",
      textAlign: "center",
      marginTop: "20px",
      fontSize: "1.1rem",
    },
  };

  const handleClear = () => {
    setRequirements("");
    setCode("");
    setAnalysisResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in.");
      }

      // Check for empty inputs before sending to backend
      if (!requirements.trim()) {
        throw new Error("Exam questions (requirements) cannot be empty.");
      }
      if (!code.trim()) {
        throw new Error("Code snippet cannot be empty.");
      }

      const response = await axios.post(
        `http://localhost:3000/api/codecheck`,
        { requirements, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAnalysisResult(response.data.simplifiedChecklist); // Store the AI's checklist and summary

      Swal.fire({
        icon: "success",
        title: "Success",
      }); // Show a success message to the user
    } catch (err) {
      console.error("Error submitting code for analysis:", err);
      let errorMessage = "Failed to analyze code. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);

      // Handle 401 specifically to redirect to login
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid" style={styles.container}>
      <h1 className="my-4" style={styles.header}>
        Code Checker & Task Generator
      </h1>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="mb-4">
            <label
              htmlFor="requirements-textarea"
              className="form-label"
              style={{ color: styles.container.color }}
            >
              Exam Questions (Requirements):
            </label>
            <textarea
              id="requirements-textarea"
              className="form-control"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Paste your exam requirements here..."
              rows="10"
              style={styles.textarea}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="code-textarea"
              className="form-label"
              style={{ color: styles.container.color }}
            >
              Your Code:
            </label>
            <textarea
              id="code-textarea"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code snippet here..."
              rows="15"
              style={styles.textarea}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end gap-3 mb-4">
            <button
              className="btn"
              style={styles.buttonClear}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  styles.buttonHoverClear.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor =
                  styles.buttonClear.backgroundColor)
              }
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
            <button
              className="btn"
              style={styles.buttonPrimary}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  styles.buttonHoverPrimary.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor =
                  styles.buttonPrimary.backgroundColor)
              }
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze & Generate Tasks"}
            </button>
          </div>

          {/* Display Loading, Error, or Analysis Results */}
          {loading && (
            <p className="lead" style={styles.loadingText}>
              Analyzing code, generating checklist, and creating Todoist
              tasks...
            </p>
          )}

          {error && (
            <p className="lead" style={styles.errorText}>
              Error: {error}
            </p>
          )}

          {analysisResult && (
            <div style={styles.resultCard}>
              <h2 style={styles.resultHeader}>Analysis Results & Checklist</h2>
              <p style={styles.summaryText}>
                <strong>Summary:</strong> {analysisResult.summary}
              </p>
              <h3 style={styles.checklistTitle}>Detailed Checklist:</h3>
              <ul className="list-unstyled">
                {analysisResult.checklist.map((item, index) => (
                  <li key={index} style={styles.checklistItem}>
                    <span style={styles.checklistItemDescription}>
                      {item.itemDescription}
                    </span>
                    <span
                      style={{
                        ...styles.checklistItemStatus,
                        ...(item.isCompleted
                          ? styles.statusCompleted
                          : styles.statusIncomplete),
                      }}
                    >
                      Status: {item.isCompleted ? "Completed" : "Incomplete"}
                    </span>
                    <span style={styles.checklistItemDetails}>
                      Details: {item.details}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeChecker;
