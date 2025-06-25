import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";

export function Register() {
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
                ChatGPT
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
                    Create an account
                  </h2>
                </div>

                <form>
                  {/* Email Input */}
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control form-control-lg border-0 rounded-3"
                      placeholder="Email address"
                      style={{
                        backgroundColor: "#3B1C32",
                        color: "#A64D79",
                        border: "none",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    />
                  </div>

                  {/* Continue Button */}
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-lg w-100 rounded-pill fw-semibold"
                      style={{
                        backgroundColor: "#6A1E55",
                        color: "#A64D79",
                        border: "1px solid #3B1C32",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    >
                      Continue
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mb-4">
                    <span style={{ color: "#6A1E55" }}>
                      Already have an account?{" "}
                    </span>
                    <Link
                      to="/login"
                      href="#"
                      className="text-decoration-none"
                      style={{ color: "#6C9BD1" }}
                    >
                      Log in
                    </Link>
                  </div>

                  {/* OR Divider */}
                  <div className="text-center mb-4">
                    <span
                      className="px-3 fw-semibold"
                      style={{
                        color: "#6A1E55",
                        backgroundColor: "#1A1A1D",
                      }}
                    >
                      OR
                    </span>
                    <hr
                      className="mt-0"
                      style={{
                        borderColor: "#3B1C32",
                        marginTop: "-12px",
                        zIndex: -1,
                      }}
                    />
                  </div>

                  {/* Social Login Buttons */}
                  <div className="d-grid gap-3">
                    {/* Google */}
                    <button
                      type="button"
                      className="btn btn-lg d-flex align-items-center justify-content-start rounded-3"
                      style={{
                        backgroundColor: "transparent",
                        color: "#A64D79",
                        border: "1px solid #3B1C32",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    >
                      <div className="me-3">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </div>
                      Continue with Google
                    </button>
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
              <a
                href="#"
                className="text-decoration-none me-3"
                style={{ color: "#6A1E55" }}
              >
                Terms of Use
              </a>
              <span style={{ color: "#6A1E55" }}>|</span>
              <a
                href="#"
                className="text-decoration-none ms-3"
                style={{ color: "#6A1E55" }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
