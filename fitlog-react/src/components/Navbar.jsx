import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const currentUserId =
    localStorage.getItem("fitlogCurrentUserId");

  const userName =
    localStorage.getItem("fitlogUserName") || "User";

  const workoutKey = currentUserId
    ? `fitlogWorkouts_${currentUserId}`
    : null;

  let workouts = [];

  try {
    workouts = workoutKey
      ? JSON.parse(localStorage.getItem(workoutKey)) || []
      : [];
  } catch (error) {
    console.error("Unable to load workouts:", error);
    workouts = [];
  }

  /*
    XP system:
    Each saved workout gives the user 100 XP.
    Every 500 XP increases the user's level.
  */

  const xpPerWorkout = 100;
  const xpRequiredPerLevel = 500;

  const totalXp =
    workouts.length * xpPerWorkout;

  const userLevel =
    Math.floor(totalXp / xpRequiredPerLevel) + 1;

  const currentLevelXp =
    totalXp % xpRequiredPerLevel;

  const levelProgress =
    (currentLevelXp / xpRequiredPerLevel) * 100;

  const xpUntilNextLevel =
    xpRequiredPerLevel - currentLevelXp;

  function getLinkClass({ isActive }) {
    return isActive
      ? "nav-link active"
      : "nav-link";
  }

  function handleLogoClick() {
    window.location.href = "/dashboard";
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
        <button
          type="button"
          className="sidebar-logo-button"
          onClick={handleLogoClick}
          aria-label="Return to Dashboard"
          title="Return to Dashboard"
        >
          <img
            src="/fitlog-logo.png"
            alt="FitLog logo"
            className="sidebar-logo"
          />
        </button>
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

      <section className="sidebar-level-card">
        <div className="sidebar-level-header">
          <div className="sidebar-level-icon">
            🏆
          </div>

          <div>
            <span>FitLog Level</span>

            <strong>
              Level {userLevel}
            </strong>
          </div>
        </div>

        <div className="sidebar-xp-information">
          <span>
            {currentLevelXp} / {xpRequiredPerLevel} XP
          </span>

          <strong>
            {Math.round(levelProgress)}%
          </strong>
        </div>

        <div className="sidebar-xp-progress">
          <div
            className="sidebar-xp-progress-fill"
            style={{
              width: `${levelProgress}%`,
            }}
          />
        </div>

        <p>
          {workouts.length === 0
            ? "Complete your first workout to earn XP."
            : `${xpUntilNextLevel} XP until Level ${
                userLevel + 1
              }.`}
        </p>
      </section>

      <button
        className="sidebar-logout"
        type="button"
        onClick={handleLogout}
      >
        <span aria-hidden="true">↪</span>
        Logout
      </button>

      <div className="sidebar-bottom-section">
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

        <footer className="sidebar-footer">
          <strong>FitLog v1.0</strong>

          <span>Track • Train • Improve</span>

          <small>Built with React + Vite</small>
        </footer>
      </div>
    </aside>
  );
}

export default Navbar;
