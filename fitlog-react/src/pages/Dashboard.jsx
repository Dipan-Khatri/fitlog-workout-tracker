import { Link } from "react-router-dom";

function Dashboard() {
  const workouts =
    JSON.parse(localStorage.getItem("fitlogWorkouts")) || [];

  const totalDuration = workouts.reduce(
    (total, workout) =>
      total + Number(workout.duration || 0),
    0
  );

  const totalVolume = workouts.reduce(
    (total, workout) =>
      total +
      Number(workout.sets || 0) *
        Number(workout.reps || 0) *
        Number(workout.weight || 0),
    0
  );

  const recentWorkouts = [...workouts]
    .reverse()
    .slice(0, 5);

  return (
    <section className="content-page">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, User!</h1>
          <p>Here is your fitness overview.</p>
        </div>

        <Link
          to="/add-workout"
          className="dashboard-add-button"
        >
          + Add Workout
        </Link>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">🏋</div>

          <div>
            <span>Total Workouts</span>
            <strong>{workouts.length}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">◷</div>

          <div>
            <span>Total Duration</span>
            <strong>{totalDuration} min</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">↗</div>

          <div>
            <span>Total Volume</span>
            <strong>
              {totalVolume.toLocaleString()} lbs
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon purple">★</div>

          <div>
            <span>Current Streak</span>
            <strong>
              {workouts.length > 0
                ? `${workouts.length} day`
                : "0 days"}
            </strong>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <div className="card-title-row">
            <h2>Recent Workouts</h2>

            <Link to="/history">View all</Link>
          </div>

          {recentWorkouts.length === 0 ? (
            <div className="dashboard-empty">
              <p>No workouts recorded yet.</p>

              <Link to="/add-workout">
                Add your first workout
              </Link>
            </div>
          ) : (
            <div className="recent-workout-list">
              {recentWorkouts.map((workout) => (
                <div
                  className="recent-workout"
                  key={workout.id}
                >
                  <div className="recent-icon">🏋</div>

                  <div className="recent-info">
                    <strong>{workout.workoutName}</strong>
                    <span>{workout.exerciseName}</span>
                  </div>

                  <div className="recent-date">
                    <span>{workout.date}</span>
                    <small>{workout.duration} min</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="dashboard-card">
          <h2>Progress Overview</h2>

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(
                  workouts.length * 12,
                  100
                )}%`,
              }}
            />
          </div>

          <p className="progress-message">
            Your activity will increase as you add workouts.
          </p>

          <div className="quick-summary">
            <div>
              <strong>{totalDuration}</strong>
              <span>Total minutes</span>
            </div>

            <div>
              <strong>
                {totalVolume.toLocaleString()}
              </strong>
              <span>Total pounds lifted</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
