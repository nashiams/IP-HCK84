"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectTo = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    setError(null);
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
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      let message = "Registration failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message);
      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Encoded JWT ID token from Google: " + response.credential);
      const backendResponse = await axios.post(
        `http://localhost:3000/api/authentic/google`,
        {
          googleToken: response.credential,
        }
      );
      const { access_token } = backendResponse.data;
      console.log(access_token, "<<<<");
      localStorage.setItem("access_token", access_token);
      redirectTo("/");
    } catch (err) {
      console.error("Google login error:", err);
      let message = "Google login failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cabin:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <div
        className="min-vh-100 d-flex flex-column"
        style={{
          backgroundColor: "#0F0F12",
          fontFamily: "Cabin, sans-serif",
        }}
      >
        {/* Header */}
        <div className="container-fluid py-4">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="p-1 rounded"
                  style={{
                    backgroundColor: "#f0f6fc",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="bi bi-shield-check"
                    style={{ color: "#0F0F12", fontSize: "14px" }}
                  ></i>
                </div>
                <h4
                  className="mb-0 fw-bold"
                  style={{
                    color: "#f0f6fc",
                    fontFamily: "Cabin, sans-serif",
                    fontSize: "18px",
                  }}
                >
                  Codecheck
                </h4>
              </div>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-link p-2 rounded-circle"
                style={{
                  color: "#8b949e",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <i className="bi bi-moon" style={{ fontSize: "18px" }}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                {/* Navigation Tabs */}
                <div className="mb-4">
                  <div
                    className="d-flex rounded-3 p-1"
                    style={{
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                    }}
                  >
                    <Link
                      to="/login"
                      className="btn flex-fill py-2 px-3 rounded-2 fw-semibold text-decoration-none"
                      style={{
                        backgroundColor: "transparent",
                        color: "#8b949e",
                        border: "none",
                        fontSize: "14px",
                      }}
                    >
                      Sign In
                    </Link>
                    <button
                      className="btn flex-fill py-2 px-3 rounded-2 fw-semibold"
                      style={{
                        backgroundColor: "#21262d",
                        color: "#f0f6fc",
                        border: "none",
                        fontSize: "14px",
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Register Form Card */}
                <div
                  className="p-4"
                  style={{
                    backgroundColor: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: "12px",
                  }}
                >
                  <div className="mb-4">
                    <h2
                      className="fw-bold mb-2"
                      style={{
                        color: "#f0f6fc",
                        fontFamily: "Cabin, sans-serif",
                        fontSize: "24px",
                      }}
                    >
                      Sign Up
                    </h2>
                    <p
                      style={{
                        color: "#8b949e",
                        fontSize: "14px",
                        margin: 0,
                      }}
                    >
                      Enter your information below to create your account
                    </p>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div
                      className="alert text-center mb-3"
                      role="alert"
                      style={{
                        backgroundColor: "#da3633",
                        color: "#fff",
                        border: "1px solid #da3633",
                        borderRadius: "8px",
                        padding: "12px",
                        fontSize: "14px",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleRegister}>
                    {/* Name Input */}
                    <div className="mb-3">
                      <label
                        htmlFor="name"
                        className="form-label fw-semibold"
                        style={{
                          color: "#f0f6fc",
                          fontSize: "14px",
                          marginBottom: "8px",
                        }}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control border-0"
                        placeholder="Your Name"
                        value={name}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: "#0d1117",
                          color: "#f0f6fc",
                          border: "1px solid #30363d",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "14px",
                        }}
                        required
                        autoComplete="name"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                      <label
                        htmlFor="email"
                        className="form-label fw-semibold"
                        style={{
                          color: "#f0f6fc",
                          fontSize: "14px",
                          marginBottom: "8px",
                        }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control border-0"
                        placeholder="m@example.com"
                        value={email}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: "#0d1117",
                          color: "#f0f6fc",
                          border: "1px solid #30363d",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "14px",
                        }}
                        required
                        autoComplete="email"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                        style={{
                          color: "#f0f6fc",
                          fontSize: "14px",
                          marginBottom: "8px",
                        }}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        className="form-control border-0"
                        placeholder="password"
                        value={password}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: "#0d1117",
                          color: "#f0f6fc",
                          border: "1px solid #30363d",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "14px",
                        }}
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    {/* Register Button */}
                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn w-100 fw-semibold"
                        style={{
                          backgroundColor: "#f0f6fc",
                          color: "#0F0F12",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "14px",
                        }}
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Register"}
                      </button>
                    </div>

                    {/* Google Register Button */}
                    <div className="d-grid">
                      <button
                        type="button"
                        className="btn d-flex align-items-center justify-content-center gap-2 fw-semibold"
                        style={{
                          backgroundColor: "#21262d",
                          color: "#f0f6fc",
                          border: "1px solid #30363d",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "14px",
                        }}
                        onClick={() => {
                          document
                            .getElementById("google-btn")
                            .querySelector("div[role=button]")
                            ?.click();
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
                      </button>
                      <div id="google-btn" style={{ display: "none" }}></div>
                    </div>
                  </form>

                  {/* Footer */}
                  <div className="text-center mt-4">
                    <small style={{ color: "#6e7681", fontSize: "12px" }}>
                      built with DevChecklist.AI
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
