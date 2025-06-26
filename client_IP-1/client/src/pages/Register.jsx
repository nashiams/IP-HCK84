import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // Corrected import from react-router-dom
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Styling based on your palette
  const styles = {
    container: {
      backgroundColor: "#1A1A1D",
      fontFamily: "Roboto, sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    headerText: {
      color: "#A64D79",
      fontFamily: "Cascadia Code, monospace",
    },
    input: {
      backgroundColor: "#3B1C32",
      color: "#A64D79",
      border: "none",
      fontFamily: "Roboto, sans-serif",
    },
    button: {
      backgroundColor: "#6A1E55",
      color: "#A64D79",
      border: "1px solid #3B1C32",
      fontFamily: "Roboto, sans-serif",
    },
    linkText: {
      color: "#6A1E55",
    },
    linkAccent: {
      color: "#6C9BD1",
    },
    dividerText: {
      color: "#6A1E55",
      backgroundColor: "#1A1A1D", // Match background for overlay effect
      zIndex: 1, // Ensure text is above the line
    },
    dividerLine: {
      borderColor: "#3B1C32",
      marginTop: "-12px", // Pull line up behind OR text
      zIndex: 0, // Ensure line is behind OR text
    },
    errorBox: {
      backgroundColor: "#ffcccc",
      color: "#cc0000",
      borderColor: "#cc0000",
      borderRadius: "8px",
    },
    label: {
      // Style for the new labels
      color: "#f0f6fc", // Light gray/white for text
      marginBottom: "8px", // Space below label
      display: "block", // Ensure label takes full width
      fontSize: "0.9rem",
    },
  };

  const handleInputChange = (e) => {
    setError(null); // Clear error on input change
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // API call to your backend's register endpoint
      await axios.post(`http://localhost:3000/api/authentic/`, {
        name,
        email,
        password,
      });

      Swal.fire({
        title: "Success!",
        text: "Registration successful. Please log in.",
        icon: "success",
      });

      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      console.error("Registration error:", err);
      let message = "Registration failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message); // Set error state to display in UI

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Google Fonts CDN links are typically in public/index.html or a global CSS file */}
      {/* Keeping them here as per previous context, but best practice is elsewhere */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <div className="min-vh-100 d-flex flex-column" style={styles.container}>
        {/* Header */}
        <div className="container-fluid py-3">
          <div className="row">
            <div className="col">
              <h4 className="mb-0 fw-bold" style={styles.headerText}>
                DevChecklist.AI {/* Changed to your app name */}
              </h4>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-4" style={styles.headerText}>
                    Create an account
                  </h2>
                </div>

                {/* Error Display */}
                {error && (
                  <div
                    className="alert alert-danger text-center"
                    role="alert"
                    style={styles.errorBox}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  {/* Name Input */}
                  <div className="mb-3">
                    <label htmlFor="name-input" style={styles.label}>
                      Name:
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name-input" // Added id to link with label
                      className="form-control form-control-lg border-0 rounded-3"
                      placeholder="Your Name"
                      value={name}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  {/* Email Input */}
                  <div className="mb-3">
                    <label htmlFor="email-input" style={styles.label}>
                      Email address:
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email-input" // Added id to link with label
                      className="form-control form-control-lg border-0 rounded-3"
                      placeholder="Email address"
                      value={email}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <label htmlFor="password-input" style={styles.label}>
                      Password:
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password-input" // Added id to link with label
                      className="form-control form-control-lg border-0 rounded-3"
                      placeholder="Password"
                      value={password}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>

                  {/* Register Button */}
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-lg w-100 rounded-pill fw-semibold"
                      style={styles.button}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mb-4">
                    <span style={styles.linkText}>
                      Already have an account?{" "}
                    </span>
                    <Link
                      to="/login"
                      className="text-decoration-none"
                      style={styles.linkAccent}
                    >
                      Log in
                    </Link>
                  </div>

                  {/* OR Divider (keeping it even if no social login, for visual consistency with login page) */}
                  <div
                    className="text-center mb-4"
                    style={{ position: "relative" }}
                  >
                    <span
                      className="px-3 fw-semibold"
                      style={{
                        ...styles.dividerText,
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      OR
                    </span>
                    <hr
                      className="mt-0"
                      style={{
                        ...styles.dividerLine,
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        zIndex: 1,
                      }}
                    />
                  </div>

                  {/* Social Login Buttons (empty div, as per removal request) */}
                  <div className="d-grid gap-3">
                    {/* The Google login button section is removed */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="container-fluid py-3">
          <div className="row">
            <div className="col text-center">
              <Link
                to="#"
                className="text-decoration-none me-3"
                style={styles.linkText}
              >
                Terms of Use
              </Link>
              <span style={styles.linkText}>|</span>
              <Link
                to="#"
                className="text-decoration-none ms-3"
                style={styles.linkText}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
