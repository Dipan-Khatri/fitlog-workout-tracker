import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function getLinkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  function handleLogout() {
    localStorage.removeItem("fitlogLoggedIn");
    localStorage.removeItem("fitlogUserEmail");
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
        <NavLink to="/dashboard" className={getLinkClass}>
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink to="/add-workout" className={getLinkClass}>
          <span>＋</span>
          Add Workout
        </NavLink>

        <NavLink to="/history" className={getLinkClass}>
          <span>◷</span>
          History
        </NavLink>

        <NavLink to="/progress" className={getLinkClass}>
          <span>▥</span>
          Progress
        </NavLink>
      </nav>

      <button
        className="sidebar-logout"
        type="button"
        onClick={handleLogout}
      >
        <span>↪</span>
        Logout
      </button>

      <div className="sidebar-user">
        <div className="user-avatar">U</div>

        <div>
          <strong>User</strong>
          <small>FitLog Member</small>
        </div>
      </div>
    </aside>
  );
}

export default Navbar;