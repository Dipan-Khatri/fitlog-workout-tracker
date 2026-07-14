import { Link } from "react-router-dom";

const motivationalQuotes = [
  {
    text: "Consistency is more important than perfection.",
    author: "FitLog",
    icon: "🔥",
  },
  {
    text: "Every workout brings you one step closer to your goal.",
    author: "FitLog",
    icon: "💪",
  },
  {
    text: "Success starts with self-discipline.",
    author: "FitLog",
    icon: "🏆",
  },
  {
    text: "Strong today. Stronger tomorrow.",
    author: "FitLog",
    icon: "⚡",
  },
  {
    text: "Progress happens one workout at a time.",
    author: "FitLog",
    icon: "📈",
  },
  {
    text: "Do not wait for motivation. Build a routine.",
    author: "FitLog",
    icon: "🎯",
  },
  {
    text: "Your only competition is who you were yesterday.",
    author: "FitLog",
    icon: "🚀",
  },
];

function getStartOfWeek(date) {
  const currentDate = new Date(date);
  const day = currentDate.getDay();

  // Make Monday the first day of the week.
  const difference = day === 0 ? -6 : 1 - day;

  currentDate.setDate(currentDate.getDate() + difference);
  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Dashboard() {
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

  const now = new Date();
  const currentHour = now.getHours();

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

  const today = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // The quote changes once each day instead of every refresh.
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now - startOfYear) / (1000 * 60 * 60 * 24)
  );

  const dailyQuote =
    motivationalQuotes[dayOfYear % motivationalQuotes.length];

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

  /*
    WEEKLY CALENDAR
    Creates Monday through Sunday for the current week.
  */
  const startOfWeek = getStartOfWeek(now);

  const weeklyDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    const dateKey = formatDateKey(date);

    const workoutsForDay = workouts.filter(
      (workout) => workout.date === dateKey
    );

    return {
      date,
      dateKey,
      shortDay: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      dayNumber: date.getDate(),
      isToday: dateKey === formatDateKey(now),
      hasWorkout: workoutsForDay.length > 0,
      workoutCount: workoutsForDay.length,
    };
  });

  const weeklyWorkoutCount = weeklyDays.reduce(
    (total, day) => total + day.workoutCount,
    0
  );

  const weeklyActiveDays = weeklyDays.filter(
    (day) => day.hasWorkout
  ).length;

  const weeklyGoal = 5;

  const weeklyProgress = Math.min(
    (weeklyActiveDays / weeklyGoal) * 100,
    100
  );

  /*
    Simple streak calculation:
    Counts consecutive workout dates going backward from today.
  */
  const workoutDateSet = new Set(uniqueWorkoutDates);
  let currentStreak = 0;
  const streakDate = new Date(now);
  streakDate.setHours(0, 0, 0, 0);

  // Allow a streak to continue when the user has not worked out today
  // but did work out yesterday.
  if (!workoutDateSet.has(formatDateKey(streakDate))) {
    streakDate.setDate(streakDate.getDate() - 1);
  }

  while (workoutDateSet.has(formatDateKey(streakDate))) {
    currentStreak += 1;
    streakDate.setDate(streakDate.getDate() - 1);
  }

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
            Stay consistent. Every workout brings you closer
            to your fitness goal.
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

      {/* QUOTE OF THE DAY */}

      <article className="dashboard-quote-card">
        <div className="quote-icon" aria-hidden="true">
          {dailyQuote.icon}
        </div>

        <div className="quote-content">
          <span className="quote-label">
            Motivation of the Day
          </span>

          <blockquote>
            “{dailyQuote.text}”
          </blockquote>

          <p>— {dailyQuote.author}</p>
        </div>

        <div className="quote-decoration" aria-hidden="true">
          ”
        </div>
      </article>

      {/* STATISTICS */}

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

      {/* WEEKLY CALENDAR */}

      <article className="dashboard-card weekly-calendar-card">
        <div className="card-title-row">
          <div>
            <h2>Weekly Activity</h2>

            <p className="card-subtitle">
              Your workout activity from Monday through Sunday
            </p>
          </div>

          <div className="weekly-calendar-summary">
            <strong>{weeklyActiveDays}</strong>
            <span>
              active {weeklyActiveDays === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        <div className="weekly-calendar-grid">
          {weeklyDays.map((day) => (
            <div
              key={day.dateKey}
              className={[
                "weekly-calendar-day",
                day.isToday ? "today" : "",
                day.hasWorkout ? "completed" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="calendar-day-name">
                {day.shortDay}
              </span>

              <strong className="calendar-day-number">
                {day.dayNumber}
              </strong>

              <div className="calendar-status-icon">
                {day.hasWorkout ? "✓" : "—"}
              </div>

              <small>
                {day.hasWorkout
                  ? `${day.workoutCount} ${
                      day.workoutCount === 1
                        ? "workout"
                        : "workouts"
                    }`
                  : "Rest day"}
              </small>
            </div>
          ))}
        </div>

        <div className="weekly-calendar-footer">
          <div>
            <span className="calendar-legend-dot completed" />
            Workout completed
          </div>

          <div>
            <span className="calendar-legend-dot today" />
            Today
          </div>

          <p>
            {weeklyWorkoutCount} total{" "}
            {weeklyWorkoutCount === 1
              ? "workout"
              : "workouts"}{" "}
            recorded this week
          </p>
        </div>
      </article>

      {/* RECENT WORKOUTS AND WEEKLY GOAL */}

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
                Add your first workout to begin tracking your
                progress.
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
                    <strong>{workout.workoutName}</strong>
                    <span>{workout.exerciseName}</span>
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
                Complete {weeklyGoal} active workout days
              </p>
            </div>

            <div className="goal-icon">🎯</div>
          </div>

          <div className="goal-progress-information">
            <strong>
              {Math.min(weeklyActiveDays, weeklyGoal)} /{" "}
              {weeklyGoal}
            </strong>

            <span>active days completed</span>
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
            {weeklyActiveDays >= weeklyGoal
              ? "Great job! You completed your weekly goal."
              : `${
                  weeklyGoal -
                  Math.min(weeklyActiveDays, weeklyGoal)
                } active ${
                  weeklyGoal -
                    Math.min(
                      weeklyActiveDays,
                      weeklyGoal
                    ) ===
                  1
                    ? "day"
                    : "days"
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

      {/* PROGRESS SUMMARY */}

      <article className="dashboard-card progress-overview-card">
        <div className="card-title-row">
          <div>
            <h2>Progress Overview</h2>

            <p className="card-subtitle">
              A summary of your fitness activity
            </p>
          </div>

          <Link to="/progress">View progress</Link>
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
            <span>Weekly Goal</span>
            <strong>{Math.round(weeklyProgress)}%</strong>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Dashboard;
