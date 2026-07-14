function Progress() {
  const workouts =
    JSON.parse(localStorage.getItem("fitlogWorkouts")) || [];

  const totalDuration = workouts.reduce(
    (total, workout) =>
      total + Number(workout.duration || 0),
    0
  );

  const totalSets = workouts.reduce(
    (total, workout) =>
      total + Number(workout.sets || 0),
    0
  );

  const totalReps = workouts.reduce(
    (total, workout) =>
      total + Number(workout.reps || 0),
    0
  );

  const highestWeight = workouts.reduce(
    (highest, workout) =>
      Math.max(highest, Number(workout.weight || 0)),
    0
  );

  return (
    <section className="content-page">
      <header className="page-title">
        <h1>Progress</h1>

        <p>
          Track your workout performance and achievements.
        </p>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">🏋</div>

          <div>
            <span>Workouts</span>
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
          <div className="stat-icon orange">✓</div>

          <div>
            <span>Total Sets</span>
            <strong>{totalSets}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon purple">↑</div>

          <div>
            <span>Highest Weight</span>
            <strong>{highestWeight} lbs</strong>
          </div>
        </article>
      </div>

      <div className="progress-content-grid">
        <article className="dashboard-card">
          <h2>Workout Completion</h2>

          <div className="progress-bar large">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(
                  workouts.length * 10,
                  100
                )}%`,
              }}
            />
          </div>

          <p>
            {workouts.length} workout sessions recorded.
          </p>
        </article>

        <article className="dashboard-card">
          <h2>Exercise Summary</h2>

          <div className="summary-stat-row">
            <span>Total repetitions</span>
            <strong>{totalReps}</strong>
          </div>

          <div className="summary-stat-row">
            <span>Total sets</span>
            <strong>{totalSets}</strong>
          </div>

          <div className="summary-stat-row">
            <span>Highest weight</span>
            <strong>{highestWeight} lbs</strong>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Progress;
