import React from "react";
import { Link, useNavigate } from "react-router"; // Corrected import from react-router-dom
import { useDispatch } from "react-redux"; // If you have auth slice, dispatch logout action
// import { logoutUser } from '../features/authSlice'; // Example: if you have an auth slice

function Navbar() {
  // Correct: useNavigate hook is now called inside the function component
  const navigate = useNavigate();
  const dispatch = useDispatch(); // For dispatching logout action

  const appName = "DevChecklist.AI"; // Your application name

  // Styles based on your palette
  const navStyles = {
    navbar: {
      backgroundColor: "#0d1117", // Very dark gray/black background
      borderBottom: "1px solid #30363d", // Medium gray border
      fontFamily: "Roboto, sans-serif",
    },
    brand: {
      color: "#A64D79", // Consistent with Login page header
      fontFamily: "Cascadia Code, monospace",
      fontWeight: "bold",
      fontSize: "1.5rem",
    },
    navLink: {
      color: "#f0f6fc", // Light gray/white for text
      marginRight: "15px",
      transition: "color 0.2s ease-in-out",
      textDecoration: "none", // Remove default underline
    },
    navLinkHover: {
      color: "#58a6ff", // Blue accent on hover
    },
    logoutButton: {
      backgroundColor: "#dc4c3e", // Todoist red for logout
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "8px 15px",
      fontSize: "0.9rem",
      fontWeight: "bold",
      transition: "background-color 0.2s ease",
    },
    logoutButtonHover: {
      backgroundColor: "#a73e34", // Darker red on hover
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Clear your app's JWT
    // Optionally, if you have an auth slice and logout action:
    // dispatch(logoutUser());

    navigate("/login"); // Use navigate to redirect
  };

  return (
    <nav className="navbar navbar-expand-lg" style={navStyles.navbar}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={navStyles.brand}>
          {appName}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: navStyles.brand.color }} // Style toggler icon
        >
          <span
            className="navbar-toggler-icon"
            style={{ filter: "brightness(0) invert(1)" }}
          ></span>{" "}
          {/* Make icon visible */}
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {" "}
            {/* ms-auto pushes items to the right */}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={navStyles.navLink}
                onMouseEnter={(e) =>
                  (e.target.style.color = navStyles.navLinkHover.color)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = navStyles.navLink.color)
                }
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/check-code"
                style={navStyles.navLink}
                onMouseEnter={(e) =>
                  (e.target.style.color = navStyles.navLinkHover.color)
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = navStyles.navLink.color)
                }
              >
                Code Checker
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn"
                style={navStyles.logoutButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor =
                    navStyles.logoutButtonHover.backgroundColor)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor =
                    navStyles.logoutButton.backgroundColor)
                }
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
