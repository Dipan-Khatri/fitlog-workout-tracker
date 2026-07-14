function Progress() {
  const currentUserId =
    localStorage.getItem("fitlogCurrentUserId");

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

  const totalVolume = workouts.reduce(
    (total, workout) =>
      total +
      Number(workout.sets || 0) *
        Number(workout.reps || 0) *
        Number(workout.weight || 0),
    0
  );

  const highestWeight = workouts.reduce(
    (highest, workout) =>
      Math.max(
        highest,
        Number(workout.weight || 0)
      ),
    0
  );

  const uniqueWorkoutDates = [
    ...new Set(
      workouts
        .map((workout) => workout.date)
        .filter(Boolean)
    ),
  ];

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function calculateCurrentStreak() {
    const workoutDateSet =
      new Set(uniqueWorkoutDates);

    let streak = 0;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (
      !workoutDateSet.has(
        formatDateKey(currentDate)
      )
    ) {
      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    while (
      workoutDateSet.has(
        formatDateKey(currentDate)
      )
    ) {
      streak += 1;

      currentDate.setDate(
        currentDate.getDate() - 1
      );
    }

    return streak;
  }

  const currentStreak =
    calculateCurrentStreak();

  const achievementDefinitions = [
    {
      id: "first-workout",
      title: "First Workout",
      description:
        "Complete your first workout.",
      icon: "🏅",
      unlocked: workouts.length >= 1,
      progress: Math.min(
        workouts.length,
        1
      ),
      goal: 1,
      progressLabel: `${Math.min(
        workouts.length,
        1
      )} / 1 workout`,
    },
    {
      id: "five-workouts",
      title: "Getting Consistent",
      description:
        "Complete 5 workouts.",
      icon: "💪",
      unlocked: workouts.length >= 5,
      progress: Math.min(
        workouts.length,
        5
      ),
      goal: 5,
      progressLabel: `${Math.min(
        workouts.length,
        5
      )} / 5 workouts`,
    },
    {
      id: "ten-workouts",
      title: "Workout Warrior",
      description:
        "Complete 10 workouts.",
      icon: "🏆",
      unlocked: workouts.length >= 10,
      progress: Math.min(
        workouts.length,
        10
      ),
      goal: 10,
      progressLabel: `${Math.min(
        workouts.length,
        10
      )} / 10 workouts`,
    },
    {
      id: "one-thousand-volume",
      title: "1,000 Pound Club",
      description:
        "Lift a total volume of 1,000 lbs.",
      icon: "⚡",
      unlocked: totalVolume >= 1000,
      progress: Math.min(
        totalVolume,
        1000
      ),
      goal: 1000,
      progressLabel: `${Math.min(
        totalVolume,
        1000
      ).toLocaleString()} / 1,000 lbs`,
    },
    {
      id: "five-thousand-volume",
      title: "Strength Builder",
      description:
        "Lift a total volume of 5,000 lbs.",
      icon: "🏋️",
      unlocked: totalVolume >= 5000,
      progress: Math.min(
        totalVolume,
        5000
      ),
      goal: 5000,
      progressLabel: `${Math.min(
        totalVolume,
        5000
      ).toLocaleString()} / 5,000 lbs`,
    },
    {
      id: "three-day-streak",
      title: "Three-Day Streak",
      description:
        "Record workouts on 3 consecutive days.",
      icon: "🔥",
      unlocked: currentStreak >= 3,
      progress: Math.min(
        currentStreak,
        3
      ),
      goal: 3,
      progressLabel: `${Math.min(
        currentStreak,
        3
      )} / 3 days`,
    },
    {
      id: "seven-day-streak",
      title: "Consistency Master",
      description:
        "Record workouts on 7 consecutive days.",
      icon: "⭐",
      unlocked: currentStreak >= 7,
      progress: Math.min(
        currentStreak,
        7
      ),
      goal: 7,
      progressLabel: `${Math.min(
        currentStreak,
        7
      )} / 7 days`,
    },
    {
      id: "three-hundred-minutes",
      title: "Time Under Tension",
      description:
        "Complete 300 total workout minutes.",
      icon: "⏱️",
      unlocked: totalDuration >= 300,
      progress: Math.min(
        totalDuration,
        300
      ),
      goal: 300,
      progressLabel: `${Math.min(
        totalDuration,
        300
      )} / 300 minutes`,
    },
    {
      id: "one-thousand-reps",
      title: "Rep Machine",
      description:
        "Complete 1,000 total repetitions.",
      icon: "🚀",
      unlocked: totalReps >= 1000,
      progress: Math.min(
        totalReps,
        1000
      ),
      goal: 1000,
      progressLabel: `${Math.min(
        totalReps,
        1000
      ).toLocaleString()} / 1,000 reps`,
    },
  ];

  const unlockedAchievements =
    achievementDefinitions.filter(
      (achievement) =>
        achievement.unlocked
    );

  const lockedAchievements =
    achievementDefinitions.filter(
      (achievement) =>
        !achievement.unlocked
    );

  const completionPercentage =
    achievementDefinitions.length > 0
      ? Math.round(
          (unlockedAchievements.length /
            achievementDefinitions.length) *
            100
        )
      : 0;

  return (
    <section className="content-page progress-page">
      <header className="page-title">
        <p className="page-eyebrow">
          Fitness Analytics
        </p>

        <h1>Progress & Achievements</h1>

        <p>
          Track your performance, milestones,
          and fitness accomplishments.
        </p>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">
            🏋️
          </div>

          <div>
            <span>Workouts</span>

            <strong>
              {workouts.length}
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">
            ◷
          </div>

          <div>
            <span>Total Duration</span>

            <strong>
              {totalDuration} min
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">
            ✓
          </div>

          <div>
            <span>Total Sets</span>

            <strong>{totalSets}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon purple">
            ↑
          </div>

          <div>
            <span>Highest Weight</span>

            <strong>
              {highestWeight} lbs
            </strong>
          </div>
        </article>
      </div>

      <div className="progress-content-grid">
        <article className="dashboard-card progress-summary-card">
          <div className="card-title-row">
            <div>
              <h2>Exercise Summary</h2>

              <p className="card-subtitle">
                Your combined workout totals
              </p>
            </div>
          </div>

          <div className="progress-summary-list">
            <div className="summary-stat-row">
              <span>Total repetitions</span>

              <strong>
                {totalReps.toLocaleString()}
              </strong>
            </div>

            <div className="summary-stat-row">
              <span>Total sets</span>

              <strong>{totalSets}</strong>
            </div>

            <div className="summary-stat-row">
              <span>Total volume</span>

              <strong>
                {totalVolume.toLocaleString()} lbs
              </strong>
            </div>

            <div className="summary-stat-row">
              <span>Highest weight</span>

              <strong>
                {highestWeight} lbs
              </strong>
            </div>

            <div className="summary-stat-row">
              <span>Current streak</span>

              <strong>
                {currentStreak}{" "}
                {currentStreak === 1
                  ? "day"
                  : "days"}
              </strong>
            </div>
          </div>
        </article>

        <article className="dashboard-card achievement-overview-card">
          <div className="card-title-row">
            <div>
              <h2>Achievement Progress</h2>

              <p className="card-subtitle">
                Keep training to unlock every badge
              </p>
            </div>

            <div className="achievement-percentage">
              {completionPercentage}%
            </div>
          </div>

          <div className="achievement-main-progress">
            <div
              className="achievement-main-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          <div className="achievement-overview-numbers">
            <div>
              <strong>
                {unlockedAchievements.length}
              </strong>

              <span>Unlocked</span>
            </div>

            <div>
              <strong>
                {lockedAchievements.length}
              </strong>

              <span>Remaining</span>
            </div>

            <div>
              <strong>
                {achievementDefinitions.length}
              </strong>

              <span>Total Badges</span>
            </div>
          </div>
        </article>
      </div>

      <section className="achievement-section">
        <div className="achievement-section-header">
          <div>
            <h2>Your Achievements</h2>

            <p>
              Badges unlock automatically when you
              reach each milestone.
            </p>
          </div>

          <span>
            {unlockedAchievements.length} of{" "}
            {achievementDefinitions.length} unlocked
          </span>
        </div>

        <div className="achievement-grid">
          {achievementDefinitions.map(
            (achievement) => {
              const progressPercentage =
                Math.min(
                  (achievement.progress /
                    achievement.goal) *
                    100,
                  100
                );

              return (
                <article
                  key={achievement.id}
                  className={
                    achievement.unlocked
                      ? "achievement-card unlocked"
                      : "achievement-card locked"
                  }
                >
                  <div className="achievement-card-top">
                    <div className="achievement-icon">
                      {achievement.unlocked
                        ? achievement.icon
                        : "🔒"}
                    </div>

                    <div
                      className={
                        achievement.unlocked
                          ? "achievement-status unlocked"
                          : "achievement-status locked"
                      }
                    >
                      {achievement.unlocked
                        ? "Unlocked"
                        : "Locked"}
                    </div>
                  </div>

                  <h3>
                    {achievement.title}
                  </h3>

                  <p>
                    {achievement.description}
                  </p>

                  <div className="achievement-card-progress">
                    <div
                      className="achievement-card-progress-fill"
                      style={{
                        width: `${progressPercentage}%`,
                      }}
                    />
                  </div>

                  <span className="achievement-progress-label">
                    {achievement.progressLabel}
                  </span>
                </article>
              );
            }
          )}
        </div>
      </section>

      {workouts.length === 0 && (
        <div className="achievement-empty-message">
          <div>🏁</div>

          <h2>
            Your achievement journey starts here
          </h2>

          <p>
            Record your first workout to unlock
            your first FitLog badge.
          </p>
        </div>
      )}
    </section>
  );
}

export default Progress;
