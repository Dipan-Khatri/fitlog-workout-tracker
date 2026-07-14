import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("fitlogUserName") || "User";

  function getLinkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  function handleLogout() {
    localStorage.removeItem("fitlogLoggedIn");
    localStorage.removeItem("fitlogCurrentUserId");
    localStorage.removeItem("fitlogUserEmail");
    localStorage.removeItem("fitlogUserName");

    navigate("/login");
  }

  return (
    <aside className="fitlog-sidebar">
      <div className="sidebar-logo-section">
        <img
          src="/fitlog-logo.png"
          alt="FitLog logo"
          className="sidebar-logo"
        />
      </div>

      <nav className="sidebar-navigation">
        <NavLink
          to="/dashboard"
          className={getLinkClass}
        >
          <span aria-hidden="true">⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/add-workout"
          className={getLinkClass}
        >
          <span aria-hidden="true">＋</span>
          Add Workout
        </NavLink>

        <NavLink
          to="/history"
          className={getLinkClass}
        >
          <span aria-hidden="true">◷</span>
          History
        </NavLink>

        <NavLink
          to="/progress"
          className={getLinkClass}
        >
          <span aria-hidden="true">▥</span>
          Progress
        </NavLink>

        <NavLink
          to="/profile"
          className={getLinkClass}
        >
          <span aria-hidden="true">◎</span>
          Profile
        </NavLink>
      </nav>

      <button
        className="sidebar-logout"
        type="button"
        onClick={handleLogout}
      >
        <span aria-hidden="true">↪</span>
        Logout
      </button>

      <NavLink
        to="/profile"
        className="sidebar-user sidebar-user-link"
      >
        <div className="user-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{userName}</strong>
          <small>FitLog Member</small>
        </div>
      </NavLink>
    </aside>
  );
}

export default Navbar;
