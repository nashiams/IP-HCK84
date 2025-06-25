import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"; // As requested, using 'react-router'
import axios from "axios"; // Import axios for API calls

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State for displaying login errors
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  // Helper function for redirection using window.location.href
  const redirectTo = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Correct for Vite
        callback: handleGoogleCredentialResponse, // Renamed for clarity
      });

      // Render the Google Sign-In button
      google.accounts.id.renderButton(document.getElementById("google-btn"), {
        theme: "outline",
        size: "large",
      });

      // Optional: Prompt the user to log in with Google automatically
      // You might want to control when this prompt appears (e.g., only on first visit)
      // google.accounts.id.prompt();
    }
  }, []);

  const handleInputChange = (e) => {
    setError(null); // Clear error when input changes
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleManualLoginSubmit = async (e) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();

    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post(
        `http://localhost:3000/api/authentic/login`, // Your specified backend endpoint
        { email, password }
      );
      console.log(response.data, "<<<<"); // Log the response data for debugging

      // Save your application's JWT to localStorage
      localStorage.setItem("access_token", response.data.token);

      // Redirect to the root path
      navigate("/");
    } catch (err) {
      console.error("Manual login error:", err);
      // Determine the error message to display to the user
      let message = "Login failed. Please check your credentials.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message); // Set error state to display in UI
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true); // Start loading for Google login
    setError(null); // Clear any previous errors

    try {
      console.log("Encoded JWT ID token from Google: " + response.credential);

      // Send the Google ID token to your backend's Google login endpoint
      const backendResponse = await axios.post(
        `http://localhost:3000/api/auth/google`, // Your backend Google login endpoint
        { googleToken: response.credential }
      );

      const { access_token } = backendResponse.data;
      console.log(access_token, "<<<<"); // Log the token as requested

      // Save your application's JWT to localStorage
      localStorage.setItem("access_token", access_token);

      // Redirect to the root path
      redirectTo("/");
    } catch (err) {
      console.error("Google login error:", err);
      let message = "Google login failed. Please try again.";
      if (err.response && err.response.data && err.response.data.message) {
        message = err.response.data.message;
      }
      setError(message); // Set error state to display in UI
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <div
        className="min-vh-100 d-flex flex-column"
        style={{ backgroundColor: "#1A1A1D", fontFamily: "Roboto, sans-serif" }}
      >
        {/* Header */}
        <div className="container-fluid py-3">
          <div className="row">
            <div className="col">
              <h4
                className="mb-0 fw-bold"
                style={{
                  color: "#A64D79",
                  fontFamily: "Cascadia Code, monospace",
                }}
              >
                DevChecklist.AI {/* Updated header text */}
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
                  <h2
                    className="fw-bold mb-4"
                    style={{
                      color: "#A64D79",
                      fontFamily: "Cascadia Code, monospace",
                    }}
                  >
                    Welcome back
                  </h2>
                </div>

                {/* Error Display */}
                {error && (
                  <div
                    className="alert alert-danger text-center"
                    role="alert"
                    style={{
                      backgroundColor: "#ffcccc",
                      color: "#cc0000",
                      borderColor: "#cc0000",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleManualLoginSubmit}>
                  {/* Email Input */}
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg border-0 rounded-3"
                      placeholder="Email address"
                      value={email}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "#3B1C32", color: "#A64D79" }}
                      required
                      autoComplete="email" // For better UX
                    />
                  </div>

                  {/* Password Input */}
                  <div className="mb-3">
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg border-0 rounded-3"
                      placeholder="Password"
                      value={password}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "#3B1C32", color: "#A64D79" }}
                      required
                      autoComplete="current-password" // For better UX
                    />
                  </div>

                  {/* Sign In Button */}
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-lg w-100 rounded-pill fw-semibold"
                      style={{ backgroundColor: "#6A1E55", color: "#A64D79" }}
                      disabled={loading} // Disable button when loading
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center mb-4">
                    <span style={{ color: "#6A1E55" }}>
                      Don't have an account?{" "}
                    </span>
                    <Link
                      to="/register"
                      className="text-decoration-none"
                      style={{ color: "#6C9BD1" }}
                    >
                      Sign up
                    </Link>
                  </div>

                  {/* OR Divider */}
                  <div className="text-center mb-4">
                    <span
                      className="px-3 fw-semibold"
                      style={{ color: "#6A1E55" }}
                    >
                      OR
                    </span>
                    <hr
                      className="mt-0"
                      style={{ borderColor: "#3B1C32", marginTop: "-12px" }}
                    />
                  </div>

                  {/* Google Login Button */}
                  <div className="d-grid gap-3">
                    <div id="google-btn"></div>
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
              <Link // Changed <a> to Link
                to="#"
                className="text-decoration-none me-3"
                style={{ color: "#6A1E55" }}
              >
                Terms of Use
              </Link>
              <span style={{ color: "#6A1E55" }}>|</span>
              <Link // Changed <a> to Link
                to="#"
                className="text-decoration-none ms-3"
                style={{ color: "#6A1E55" }}
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
