import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Sidebar = ({ role }) => {
  const [openMenu, setOpenMenu] = useState({});
  const [isSidebarMini, setIsSidebarMini] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarMini((prev) => !prev);
  };

  return (
    <div
      className={`sidebar px-4 py-4 py-md-5 me-0 ${
        isSidebarMini ? "sidebar-mini" : ""
      }`}
    >
      <div className="d-flex flex-column h-100">
        <Link to="/" className="mb-0 brand-icon">
          <span className="logo-icon">
            <img
              src="../assets/images/logoInt.png"
              alt="logo"
              width="35"
              height="35"
            />
          </span>
          {!isSidebarMini && <span className="logo-text">My-Task</span>}
        </Link>

        <ul className="menu-list flex-grow-1 mt-3">
          {/* Common Menus */}
          <li>
            <NavLink
              className={({ isActive }) => `m-link ${isActive ? "active" : ""}`}
              to="/profile"
            >
              <i className="icofont-user-alt-5"></i>
              {!isSidebarMini && <span>Profile</span>}
            </NavLink>
          </li>

          {/* Role-Specific Menus */}
          {role === "Employee" && (
            <>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/my-tasks"
                >
                  <i className="icofont-contrast"></i>{" "}
                  {!isSidebarMini && <span>My Tasks</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/projects"
                >
                  <i className="icofont-briefcase"></i>
                  {!isSidebarMini && <span>Projects</span>}
                </NavLink>
              </li>
              {/* Add Calendar Link */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/calendar"
                >
                  <i className="icofont-calendar"></i>
                  {!isSidebarMini && <span>Calendar</span>}
                </NavLink>
              </li>
              {/* Add Chat Link for Employees */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/chat"
                >
                  <i className="icofont-chat"></i>
                  {!isSidebarMini && <span>Chat</span>}
                </NavLink>
              </li>
              {/* Add Friends Link for Employees */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/friends"
                >
                  <i className="icofont-users-alt-5"></i>
                  {!isSidebarMini && <span>Friends</span>}
                </NavLink>
              </li>
            </>
          )}

          {role === "Company" && (
            <>
              {/* Company Menu */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/Company/Profile"
                >
                  <i className="icofont-building-alt"></i>
                  {!isSidebarMini && <span>Company</span>}
                </NavLink>
              </li>

              {/* Employees Menu */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/company/employees"
                >
                  <i className="icofont-users-alt-5"></i>
                  {!isSidebarMini && <span>Employees</span>}
                </NavLink>
              </li>

              {/* Projects Menu */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/projects"
                >
                  <i className="icofont-briefcase"></i>
                  {!isSidebarMini && <span>Projects</span>}
                </NavLink>
              </li>

              {/* Add Calendar Link */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/calendar"
                >
                  <i className="icofont-calendar"></i>
                  {!isSidebarMini && <span>Calendar</span>}
                </NavLink>
              </li>

              {/* Add Chat Link for Company */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/chat"
                >
                  <i className="icofont-chat"></i>
                  {!isSidebarMini && <span>Chat</span>}
                </NavLink>
              </li>

              {/* Add Friends Link for Company */}
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `m-link ${isActive ? "active" : ""}`
                  }
                  to="/friends"
                >
                  <i className="icofont-users-alt-5"></i>
                  {!isSidebarMini && <span>Friends</span>}
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <button
          type="button"
          className="btn btn-link sidebar-mini-btn text-light"
          onClick={toggleSidebar}
        >
          <span className="ms-2">
            <i
              className={`icofont-bubble-${isSidebarMini ? "left" : "right"}`}
            ></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
