import React from "react";
import { Link, useNavigate } from "react-router"; // Corrected import from react-router-dom
import { useDispatch } from "react-redux"; // If you have auth slice, dispatch logout action
// import { logoutUser } from '../features/authSlice'; // Example: if you have an auth slice
function Navbar() {
  const navigate = useNavigate();
  const appName = "Codechecker";
  let name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&display=swap"
        rel="stylesheet"
      />

      <nav
        className="navbar navbar-expand-lg "
        style={{
          backgroundColor: "#0F0F12",
          borderColor: "#1F1F23",
          fontFamily: "Cabin, sans-serif",
          height: "64px",
        }}
      >
        <div className="container-fluid px-4">
          {/* Breadcrumb section */}
          <div className="d-none d-sm-flex align-items-center">
            <nav aria-label="breadcrumb">
              <ol
                className="breadcrumb mb-0"
                style={{
                  fontSize: "20px",
                  fontFamily: "STIX Two Text",
                  fontWeight: 500,
                }}
              >
                <li className="breadcrumb-item">
                  <Link
                    to="/"
                    className="text-decoration-none"
                    style={{ color: "#e6edf3" }}
                  >
                    {appName}
                  </Link>
                </li>
              </ol>
            </nav>
          </div>

          {/* Right side items */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Notification bell */}
            <button
              className="btn btn-link p-2 rounded-circle"
              style={{
                color: "#8b949e",
                backgroundColor: "transparent",
                border: "none",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1F1F23")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              <i className="bi bi-bell" style={{ fontSize: "18px" }}></i>
            </button>

            {/* Navigation Links */}
            <Link
              className="nav-link d-none d-md-inline-block text-decoration-none px-2"
              to="/check-code"
              style={{
                color: "#e6edf3",
                fontSize: "14px",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#f0f6fc")}
              onMouseLeave={(e) => (e.target.style.color = "#e6edf3")}
            >
              Code Checker
            </Link>

            {/* Profile dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-link p-0 border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span
                  className="d-none d-md-inline-block text-decoration-none px-2"
                  style={{
                    color: "#e6edf3",
                    fontSize: "14px",
                    fontWeight: "500",
                    lineHeight: "24px",
                  }}
                >
                  Hi, {name}
                </span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                style={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                  minWidth: "200px",
                }}
              >
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center gap-2"
                    to="/"
                    style={{ color: "#f0f6fc", fontSize: "14px" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#21262d")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <i className="bi bi-house"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <hr
                    className="dropdown-divider"
                    style={{ borderColor: "#30363d" }}
                  />
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 w-100 border-0 bg-transparent"
                    style={{ color: "#f0f6fc", fontSize: "14px" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#21262d")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
