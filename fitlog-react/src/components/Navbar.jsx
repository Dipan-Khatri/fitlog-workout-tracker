import { useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

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
      ? JSON.parse(
          localStorage.getItem(workoutKey)
        ) || []
      : [];
  } catch (error) {
    console.error(
      "Unable to load workouts:",
      error
    );

    workouts = [];
  }

  const xpPerWorkout = 100;
  const xpRequiredPerLevel = 500;

  const totalXp =
    workouts.length * xpPerWorkout;

  const userLevel =
    Math.floor(
      totalXp / xpRequiredPerLevel
    ) + 1;

  const currentLevelXp =
    totalXp % xpRequiredPerLevel;

  const levelProgress =
    (
      currentLevelXp /
      xpRequiredPerLevel
    ) * 100;

  const xpUntilNextLevel =
    xpRequiredPerLevel -
    currentLevelXp;

  function getLinkClass({
    isActive,
  }) {
    return isActive
      ? "nav-link active"
      : "nav-link";
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogoClick() {
    closeMobileMenu();

    window.location.href =
      "/dashboard";
  }

  function handleLogout() {
    localStorage.removeItem(
      "fitlogLoggedIn"
    );

    localStorage.removeItem(
      "fitlogCurrentUserId"
    );

    localStorage.removeItem(
      "fitlogUserEmail"
    );

    localStorage.removeItem(
      "fitlogUserName"
    );

    closeMobileMenu();
    navigate("/login");
  }

  function getPageTitle() {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";

      case "/add-workout":
        return "Add Workout";

      case "/history":
        return "History";

      case "/progress":
        return "Progress";

      case "/profile":
        return "Profile";

      default:
        return "FitLog";
    }
  }

  return (
    <>
      <header className="mobile-topbar">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(true)
          }
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <button
          type="button"
          className="mobile-logo-button"
          onClick={handleLogoClick}
          aria-label="Open Dashboard"
        >
          <img
            src="/fitlog-logo.png"
            alt="FitLog logo"
          />
        </button>

        <strong>
          {getPageTitle()}
        </strong>
      </header>

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-sidebar-overlay"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={
          mobileMenuOpen
            ? "fitlog-sidebar mobile-open"
            : "fitlog-sidebar"
        }
      >
        <div className="sidebar-mobile-header">
          <span>Navigation</span>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

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
            onClick={closeMobileMenu}
          >
            <span aria-hidden="true">
              ⌂
            </span>

            Dashboard
          </NavLink>

          <NavLink
            to="/add-workout"
            className={getLinkClass}
            onClick={closeMobileMenu}
          >
            <span aria-hidden="true">
              ＋
            </span>

            Add Workout
          </NavLink>

          <NavLink
            to="/history"
            className={getLinkClass}
            onClick={closeMobileMenu}
          >
            <span aria-hidden="true">
              ◷
            </span>

            History
          </NavLink>

          <NavLink
            to="/progress"
            className={getLinkClass}
            onClick={closeMobileMenu}
          >
            <span aria-hidden="true">
              ▥
            </span>

            Progress
          </NavLink>

          <NavLink
            to="/profile"
            className={getLinkClass}
            onClick={closeMobileMenu}
          >
            <span aria-hidden="true">
              ◎
            </span>

            Profile
          </NavLink>
        </nav>

        <section className="sidebar-level-card">
          <div className="sidebar-level-header">
            <div className="sidebar-level-icon">
              🏆
            </div>

            <div>
              <span>
                FitLog Level
              </span>

              <strong>
                Level {userLevel}
              </strong>
            </div>
          </div>

          <div className="sidebar-xp-information">
            <span>
              {currentLevelXp} /{" "}
              {xpRequiredPerLevel} XP
            </span>

            <strong>
              {Math.round(
                levelProgress
              )}
              %
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
              ? "Complete a workout to earn XP."
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
          <span aria-hidden="true">
            ↪
          </span>

          Logout
        </button>

        <div className="sidebar-bottom-section">
          <NavLink
            to="/profile"
            className="sidebar-user sidebar-user-link"
            onClick={closeMobileMenu}
          >
            <div className="user-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {userName}
              </strong>

              <small>
                FitLog Member
              </small>
            </div>
          </NavLink>

          <footer className="sidebar-footer">
            <strong>
              FitLog v1.0
            </strong>

            <span>
              Track • Train • Improve
            </span>
          </footer>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
