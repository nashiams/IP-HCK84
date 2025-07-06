import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism-tomorrow.css";
import {
  setRequirements,
  setCode,
  setLoading,
  setError,
  setAnalysisResult,
  clearAll,
} from "../store/codeSlice";

function CodeChecker() {
  const dispatch = useDispatch();

  // Get state from Redux
  const { requirements, code, loading, error, analysisResult } = useSelector(
    (state) => state.code
  );

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#0F0F12",
      padding: "24px",
      fontFamily: "Cabin, sans-serif",
      color: "#f0f6fc",
    },
    header: {
      color: "#f0f6fc",
      fontFamily: "Cabin, sans-serif",
      marginBottom: "32px",
      textAlign: "left",
      fontWeight: "700",
      fontSize: "28px",
    },
    textarea: {
      backgroundColor: "#161b22",
      color: "#f0f6fc",
      border: "1px solid #30363d",
      borderRadius: "12px",
      padding: "16px",
      resize: "vertical",
      minHeight: "400px",
      fontFamily: "Cabin, sans-serif",
      fontSize: "14px",
      lineHeight: "1.5",
    },
    codeTextarea: {
      backgroundColor: "#0d1117",
      color: "#e6edf3",
      border: "1px solid #30363d",
      borderRadius: "12px",
      padding: "16px",
      resize: "vertical",
      minHeight: "400px",
      fontFamily: "'Ubuntu Mono', 'Courier New', monospace",
      fontSize: "14px",
      lineHeight: "1.6",
      tabSize: 2,
    },
    buttonPrimary: {
      backgroundColor: "#1f6feb",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      cursor: "pointer",
    },
    buttonClear: {
      backgroundColor: "#6e7681",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "14px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      cursor: "pointer",
    },
    buttonHoverPrimary: {
      backgroundColor: "#1a5feb",
    },
    buttonHoverClear: {
      backgroundColor: "#5d6570",
    },
    resultCard: {
      backgroundColor: "#161b22",
      border: "1px solid #30363d",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "32px",
      color: "#f0f6fc",
    },
    resultHeader: {
      color: "#f0f6fc",
      fontFamily: "Cabin, sans-serif",
      marginBottom: "20px",
      fontSize: "20px",
      fontWeight: "700",
    },
    summaryText: {
      fontSize: "14px",
      marginBottom: "24px",
      lineHeight: "1.6",
      color: "#e6edf3",
    },
    checklistTitle: {
      color: "#f0f6fc",
      fontSize: "16px",
      marginBottom: "16px",
      fontWeight: "600",
    },
    checklistItem: {
      backgroundColor: "#0d1117",
      border: "1px solid #21262d",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    checklistItemDescription: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#f0f6fc",
    },
    checklistItemDetails: {
      fontSize: "13px",
      color: "#8b949e",
      lineHeight: "1.4",
    },
    checklistItemStatus: {
      fontSize: "12px",
      fontWeight: "600",
    },
    statusCompleted: {
      color: "#238636",
    },
    statusIncomplete: {
      color: "#da3633",
    },
    errorText: {
      color: "#da3633",
      textAlign: "center",
      marginTop: "32px",
      fontSize: "14px",
    },
    loadingText: {
      color: "#1f6feb",
      textAlign: "center",
      marginTop: "32px",
      fontSize: "14px",
    },
  };

  const handleClear = () => {
    dispatch(clearAll());
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setAnalysisResult(null));

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in.");
      }

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

      dispatch(setAnalysisResult(response.data.simplifiedChecklist));
      Swal.fire({
        icon: "success",
        title: "Success",
      });
    } catch (err) {
      console.error("Error submitting code for analysis:", err);
      let errorMessage = "Failed to analyze code. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      dispatch(setError(errorMessage));

      if (err.response && err.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cabin:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <div className="container-fluid" style={styles.container}>
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 style={styles.header}>
              <i
                className="bi bi-code-slash me-3"
                style={{ color: "#1f6feb" }}
              ></i>
              Code Checker & Task Generator
            </h1>
            <p style={{ color: "#8b949e", fontSize: "14px", margin: 0 }}>
              Analyze your code against requirements and generate actionable
              tasks
            </p>
          </div>
        </div>

        {/* Side by Side Input Cards */}
        <div className="row">
          {/* Code Input - Left Side */}
          <div className="col-12 col-lg-6 mb-4">
            <div
              className="card border-0 h-100"
              style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "12px",
              }}
            >
              <div
                className="card-header border-0 d-flex align-items-center gap-2"
                style={{
                  backgroundColor: "#0F0F12",
                  borderRadius: "12px 12px 0 0",
                  padding: "16px 20px",
                  borderBottom: "1px solid #21262d",
                }}
              >
                <div
                  className="p-2 rounded-2"
                  style={{
                    backgroundColor: "#238636",
                    color: "#fff",
                  }}
                >
                  <i className="bi bi-braces" style={{ fontSize: "16px" }}></i>
                </div>
                <div>
                  <h6
                    className="mb-0"
                    style={{
                      color: "#f0f6fc",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "Cabin, sans-serif",
                    }}
                  >
                    Your Code
                  </h6>
                  <small style={{ color: "#8b949e", fontSize: "12px" }}>
                    Paste your code snippet here for analysis
                  </small>
                </div>
              </div>
              <div
                className="card-body position-relative"
                style={{ padding: "0" }}
              >
                {/* Code Preview with Syntax Highlighting */}
                <Editor
                  value={code}
                  onValueChange={(value) => dispatch(setCode(value))}
                  highlight={(code) =>
                    Prism.highlight(
                      code,
                      Prism.languages.javascript,
                      "javascript"
                    )
                  }
                  padding={16}
                  textareaId="code-textarea"
                  className="prism-editor__textarea"
                  style={{
                    minHeight: "400px",
                    backgroundColor: "#0d1117",
                    color: "#e6edf3",
                    fontFamily: "'Ubuntu Mono', 'Courier New', monospace",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    border: "1px solid #30363d",
                    borderRadius: "12px",
                    tabSize: 2,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    resize: "vertical",
                    overflow: "auto",
                    outline: "none",
                    width: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    caretColor: "#e6edf3",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Requirements Input - Right Side */}
          <div className="col-12 col-lg-6 mb-4">
            <div
              className="card border-0 h-100"
              style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "12px",
              }}
            >
              <div
                className="card-header border-0 d-flex align-items-center gap-2"
                style={{
                  backgroundColor: "#0F0F12",
                  borderRadius: "12px 12px 0 0",
                  padding: "16px 20px",
                  borderBottom: "1px solid #21262d",
                }}
              >
                <div
                  className="p-2 rounded-2"
                  style={{
                    backgroundColor: "#1f6feb",
                    color: "#fff",
                  }}
                >
                  <i
                    className="bi bi-file-text"
                    style={{ fontSize: "16px" }}
                  ></i>
                </div>
                <div>
                  <h6
                    className="mb-0"
                    style={{
                      color: "#f0f6fc",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "Cabin, sans-serif",
                    }}
                  >
                    Exam Questions (Requirements)
                  </h6>
                  <small style={{ color: "#8b949e", fontSize: "12px" }}>
                    Paste your exam requirements here
                  </small>
                </div>
              </div>
              <div className="card-body" style={{ padding: "0" }}>
                <textarea
                  id="requirements-textarea"
                  className="form-control border-0"
                  value={requirements}
                  onChange={(e) => dispatch(setRequirements(e.target.value))}
                  placeholder="Paste your exam requirements here..."
                  rows="20"
                  style={styles.textarea}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3 mb-4">
          <button
            className="btn d-flex align-items-center gap-2"
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
            <i className="bi bi-arrow-clockwise"></i>
            Clear
          </button>
          <button
            className="btn d-flex align-items-center gap-2"
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
            {loading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                  style={{ width: "16px", height: "16px" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Analyzing...
              </>
            ) : (
              <>
                <i className="bi bi-play-circle"></i>
                Analyze & Generate Tasks
              </>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            className="card border-0 text-center py-4"
            style={{
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "12px",
            }}
          >
            <div className="card-body">
              <div
                className="spinner-border mb-3"
                style={{ color: "#1f6feb" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="lead" style={styles.loadingText}>
                Analyzing code, generating checklist, and creating Todoist
                tasks...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="card border-0 text-center py-4"
            style={{
              backgroundColor: "#161b22",
              border: "1px solid #da3633",
              borderRadius: "12px",
            }}
          >
            <div className="card-body">
              <i
                className="bi bi-exclamation-triangle mb-3"
                style={{ fontSize: "48px", color: "#da3633" }}
              ></i>
              <p className="lead" style={styles.errorText}>
                Error: {error}
              </p>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div style={styles.resultCard}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="p-2 rounded-2"
                style={{
                  backgroundColor: "#238636",
                  color: "#fff",
                }}
              >
                <i
                  className="bi bi-check-circle"
                  style={{ fontSize: "20px" }}
                ></i>
              </div>
              <h2 style={styles.resultHeader}>Analysis Results & Checklist</h2>
            </div>

            {/* Summary Section */}
            <div
              className="p-3 rounded-3 mb-4"
              style={{
                backgroundColor: "#0d1117",
                border: "1px solid #21262d",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-2">
                <i
                  className="bi bi-info-circle"
                  style={{ color: "#1f6feb", fontSize: "16px" }}
                ></i>
                <strong style={{ color: "#f0f6fc", fontSize: "14px" }}>
                  Summary
                </strong>
              </div>
              <p style={styles.summaryText}>{analysisResult.summary}</p>
            </div>

            {/* Checklist Section */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <i
                className="bi bi-list-check"
                style={{ color: "#1f6feb", fontSize: "16px" }}
              ></i>
              <h3 style={styles.checklistTitle}>Detailed Checklist</h3>
            </div>

            <div className="row">
              {analysisResult.checklist.map((item, index) => (
                <div key={index} className="col-12 col-md-6 col-xl-4 mb-3">
                  <div style={styles.checklistItem}>
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <span style={styles.checklistItemDescription}>
                        {item.itemDescription}
                      </span>
                      <span
                        className="badge rounded-pill px-2 py-1"
                        style={{
                          backgroundColor: item.isCompleted
                            ? "#238636"
                            : "#da3633",
                          color: "#fff",
                          fontSize: "10px",
                        }}
                      >
                        <i
                          className={`bi ${
                            item.isCompleted ? "bi-check-circle" : "bi-x-circle"
                          } me-1`}
                          style={{ fontSize: "10px" }}
                        ></i>
                        {item.isCompleted ? "Completed" : "Incomplete"}
                      </span>
                    </div>
                    <span style={styles.checklistItemDetails}>
                      <strong>Details:</strong> {item.details}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div
              className="mt-4 pt-3"
              style={{ borderTop: "1px solid #21262d" }}
            >
              <div className="row text-center">
                <div className="col-4">
                  <div style={{ color: "#8b949e", fontSize: "12px" }}>
                    Total Items
                  </div>
                  <div
                    style={{
                      color: "#f0f6fc",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {analysisResult.checklist.length}
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ color: "#8b949e", fontSize: "12px" }}>
                    Completed
                  </div>
                  <div
                    style={{
                      color: "#238636",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {
                      analysisResult.checklist.filter(
                        (item) => item.isCompleted
                      ).length
                    }
                  </div>
                </div>
                <div className="col-4">
                  <div style={{ color: "#8b949e", fontSize: "12px" }}>
                    Remaining
                  </div>
                  <div
                    style={{
                      color: "#da3633",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {
                      analysisResult.checklist.filter(
                        (item) => !item.isCompleted
                      ).length
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CodeChecker;
