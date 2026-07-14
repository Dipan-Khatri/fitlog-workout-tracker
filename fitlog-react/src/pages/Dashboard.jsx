import { Link } from "react-router-dom";

function Dashboard() {
  const currentUserId =
    localStorage.getItem("fitlogCurrentUserId");

  const userName =
    localStorage.getItem("fitlogUserName") || "User";

  const workoutKey = currentUserId
    ? `fitlogWorkouts_${currentUserId}`
    : null;

  const workouts = workoutKey
    ? JSON.parse(localStorage.getItem(workoutKey)) || []
    : [];

  const currentHour = new Date().getHours();

  let greeting = "Hello";
  let greetingEmoji = "👋";

  if (currentHour < 12) {
    greeting = "Good Morning";
    greetingEmoji = "☀️";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
    greetingEmoji = "👋";
  } else {
    greeting = "Good Evening";
    greetingEmoji = "🌙";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
    .sort((firstWorkout, secondWorkout) => {
      const firstDate = new Date(
        firstWorkout.createdAt || firstWorkout.date
      );

      const secondDate = new Date(
        secondWorkout.createdAt || secondWorkout.date
      );

      return secondDate - firstDate;
    })
    .slice(0, 5);

  const uniqueWorkoutDates = [
    ...new Set(
      workouts
        .map((workout) => workout.date)
        .filter(Boolean)
    ),
  ];

  const currentStreak = uniqueWorkoutDates.length;

  const weeklyGoal = 5;

  const weeklyProgress = Math.min(
    (workouts.length / weeklyGoal) * 100,
    100
  );

  return (
    <section className="content-page dashboard-page">
      <header className="dashboard-header personalized-header">
        <div className="dashboard-header-text">
          <p className="dashboard-date">{today}</p>

          <h1>
            {greeting}, {userName}!{" "}
            <span aria-hidden="true">{greetingEmoji}</span>
          </h1>

          <p className="dashboard-motivation">
            Stay consistent. Every workout brings you
            closer to your fitness goal.
          </p>
        </div>

        <Link
          to="/add-workout"
          className="dashboard-add-button"
        >
          <span aria-hidden="true">＋</span>
          Add Workout
        </Link>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">🏋️</div>

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
              {currentStreak}{" "}
              {currentStreak === 1 ? "day" : "days"}
            </strong>
          </div>
        </article>
      </div>

      <div className="dashboard-feature-grid">
        <article className="dashboard-card recent-workouts-card">
          <div className="card-title-row">
            <div>
              <h2>Recent Workouts</h2>

              <p className="card-subtitle">
                Your latest workout activity
              </p>
            </div>

            <Link to="/history">View all</Link>
          </div>

          {recentWorkouts.length === 0 ? (
            <div className="dashboard-empty">
              <div className="empty-state-icon">🏃</div>

              <h3>No workouts recorded yet</h3>

              <p>
                Add your first workout to begin tracking
                your progress.
              </p>

              <Link
                to="/add-workout"
                className="empty-state-button"
              >
                Add First Workout
              </Link>
            </div>
          ) : (
            <div className="recent-workout-list">
              {recentWorkouts.map((workout) => (
                <div
                  className="recent-workout"
                  key={workout.id}
                >
                  <div className="recent-icon">🏋️</div>

                  <div className="recent-info">
                    <strong>
                      {workout.workoutName}
                    </strong>

                    <span>
                      {workout.exerciseName}
                    </span>
                  </div>

                  <div className="recent-date">
                    <span>{workout.date}</span>

                    <small>
                      {workout.duration || 0} min
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="dashboard-card weekly-goal-card">
          <div className="card-title-row">
            <div>
              <h2>Weekly Goal</h2>

              <p className="card-subtitle">
                Complete {weeklyGoal} workouts
              </p>
            </div>

            <div className="goal-icon">🎯</div>
          </div>

          <div className="goal-progress-information">
            <strong>
              {Math.min(workouts.length, weeklyGoal)} /{" "}
              {weeklyGoal}
            </strong>

            <span>workouts completed</span>
          </div>

          <div className="weekly-goal-progress">
            <div
              className="weekly-goal-progress-fill"
              style={{
                width: `${weeklyProgress}%`,
              }}
            />
          </div>

          <p className="goal-message">
            {workouts.length >= weeklyGoal
              ? "Great job! You completed your weekly goal."
              : `${
                  weeklyGoal -
                  Math.min(workouts.length, weeklyGoal)
                } workout${
                  weeklyGoal -
                    Math.min(
                      workouts.length,
                      weeklyGoal
                    ) ===
                  1
                    ? ""
                    : "s"
                } remaining this week.`}
          </p>

          <Link
            to="/add-workout"
            className="goal-action-link"
          >
            Log another workout →
          </Link>
        </article>
      </div>

      <article className="dashboard-card progress-overview-card">
        <div className="card-title-row">
          <div>
            <h2>Progress Overview</h2>

            <p className="card-subtitle">
              A summary of your fitness activity
            </p>
          </div>

          <Link to="/progress">
            View progress
          </Link>
        </div>

        <div className="progress-bar dashboard-progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${weeklyProgress}%`,
            }}
          />
        </div>

        <div className="dashboard-summary-grid">
          <div className="dashboard-summary-item">
            <span>Total Minutes</span>
            <strong>{totalDuration}</strong>
          </div>

          <div className="dashboard-summary-item">
            <span>Pounds Lifted</span>
            <strong>
              {totalVolume.toLocaleString()}
            </strong>
          </div>

          <div className="dashboard-summary-item">
            <span>Workout Days</span>
            <strong>{uniqueWorkoutDates.length}</strong>
          </div>

          <div className="dashboard-summary-item">
            <span>Weekly Progress</span>
            <strong>
              {Math.round(weeklyProgress)}%
            </strong>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Dashboard;
