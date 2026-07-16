import { useMemo, useState } from "react";
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

  const difference =
    day === 0 ? -6 : 1 - day;

  currentDate.setDate(
    currentDate.getDate() + difference
  );

  currentDate.setHours(0, 0, 0, 0);

  return currentDate;
}

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

function estimateCalories(workout, bodyWeight) {
  const duration =
    Number(workout.duration || 0);

  const weight =
    Number(bodyWeight || 165);

  const workoutName = String(
    workout.workoutName || ""
  ).toLowerCase();

  const exerciseName = String(
    workout.exerciseName || ""
  ).toLowerCase();

  const combinedText =
    `${workoutName} ${exerciseName}`;

  let caloriesPerMinute = 6;

  if (
    combinedText.includes("run") ||
    combinedText.includes("cardio") ||
    combinedText.includes("cycling")
  ) {
    caloriesPerMinute = 9;
  } else if (
    combinedText.includes("leg") ||
    combinedText.includes("squat") ||
    combinedText.includes("deadlift")
  ) {
    caloriesPerMinute = 8;
  } else if (
    combinedText.includes("full body") ||
    combinedText.includes("circuit")
  ) {
    caloriesPerMinute = 8.5;
  } else if (
    combinedText.includes("chest") ||
    combinedText.includes("back") ||
    combinedText.includes("push") ||
    combinedText.includes("pull") ||
    combinedText.includes("shoulder")
  ) {
    caloriesPerMinute = 7;
  }

  const weightAdjustment =
    weight / 165;

  return Math.round(
    duration *
      caloriesPerMinute *
      weightAdjustment
  );
}

function Dashboard() {
  const currentUserId =
    localStorage.getItem(
      "fitlogCurrentUserId"
    );

  const userName =
    localStorage.getItem(
      "fitlogUserName"
    ) || "User";

  const workoutKey = currentUserId
    ? `fitlogWorkouts_${currentUserId}`
    : null;

  const notesKey = currentUserId
    ? `fitlogCalendarNotes_${currentUserId}`
    : null;

  const goalKey = currentUserId
    ? `fitlogWeeklyGoal_${currentUserId}`
    : null;

  let workouts = [];
  let savedNotes = {};
  let savedUsers = [];

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

  try {
    savedNotes = notesKey
      ? JSON.parse(
          localStorage.getItem(notesKey)
        ) || {}
      : {};
  } catch (error) {
    console.error(
      "Unable to load calendar notes:",
      error
    );

    savedNotes = {};
  }

  try {
    savedUsers =
      JSON.parse(
        localStorage.getItem("fitlogUsers")
      ) || [];
  } catch (error) {
    console.error(
      "Unable to load users:",
      error
    );

    savedUsers = [];
  }

  const currentUser = savedUsers.find(
    (user) =>
      user.id === currentUserId
  );

  const bodyWeight =
    Number(currentUser?.weight) || 165;

  const [calendarNotes, setCalendarNotes] =
    useState(savedNotes);

  const [selectedDay, setSelectedDay] =
    useState(null);

  const [noteText, setNoteText] =
    useState("");

  const [noteMessage, setNoteMessage] =
    useState("");

  const [weeklyGoal, setWeeklyGoal] =
    useState(() => {
      const savedGoal = Number(
        goalKey
          ? localStorage.getItem(goalKey)
          : 5
      );

      return savedGoal >= 2 &&
        savedGoal <= 7
        ? savedGoal
        : 5;
    });

  const [goalMessage, setGoalMessage] =
    useState("");

  const now = new Date();

  const currentHour =
    now.getHours();

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

  const today =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const startOfYear =
    new Date(
      now.getFullYear(),
      0,
      0
    );

  const dayOfYear = Math.floor(
    (now - startOfYear) /
      (1000 * 60 * 60 * 24)
  );

  const dailyQuote =
    motivationalQuotes[
      dayOfYear %
        motivationalQuotes.length
    ];

  const totalDuration =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.duration || 0
        ),
      0
    );

  const totalVolume =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.sets || 0
        ) *
          Number(
            workout.reps || 0
          ) *
          Number(
            workout.weight || 0
          ),
      0
    );

  const totalCalories =
    workouts.reduce(
      (total, workout) =>
        total +
        estimateCalories(
          workout,
          bodyWeight
        ),
      0
    );

  const recentWorkouts =
    [...workouts]
      .sort(
        (
          firstWorkout,
          secondWorkout
        ) => {
          const firstDate =
            new Date(
              firstWorkout.createdAt ||
                firstWorkout.date
            );

          const secondDate =
            new Date(
              secondWorkout.createdAt ||
                secondWorkout.date
            );

          return (
            secondDate - firstDate
          );
        }
      )
      .slice(0, 5);

  const uniqueWorkoutDates = [
    ...new Set(
      workouts
        .map(
          (workout) =>
            workout.date
        )
        .filter(Boolean)
    ),
  ];

  const startOfWeek =
    getStartOfWeek(now);

  const weeklyDays =
    Array.from(
      { length: 7 },
      (_, index) => {
        const date =
          new Date(startOfWeek);

        date.setDate(
          startOfWeek.getDate() +
            index
        );

        const dateKey =
          formatDateKey(date);

        const workoutsForDay =
          workouts.filter(
            (workout) =>
              workout.date ===
              dateKey
          );

        const caloriesForDay =
          workoutsForDay.reduce(
            (total, workout) =>
              total +
              estimateCalories(
                workout,
                bodyWeight
              ),
            0
          );

        return {
          dateKey,

          shortDay:
            date.toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),

          fullDate:
            date.toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            ),

          dayNumber:
            date.getDate(),

          isToday:
            dateKey ===
            formatDateKey(now),

          hasWorkout:
            workoutsForDay.length > 0,

          workoutCount:
            workoutsForDay.length,

          workouts:
            workoutsForDay,

          calories:
            caloriesForDay,

          hasNote: Boolean(
            calendarNotes[
              dateKey
            ]?.trim()
          ),
        };
      }
    );

  const weeklyWorkoutCount =
    weeklyDays.reduce(
      (total, day) =>
        total +
        day.workoutCount,
      0
    );

  const weeklyCalories =
    weeklyDays.reduce(
      (total, day) =>
        total + day.calories,
      0
    );

  const weeklyActiveDays =
    weeklyDays.filter(
      (day) =>
        day.hasWorkout
    ).length;

  const weeklyProgress =
    Math.min(
      (
        weeklyActiveDays /
        weeklyGoal
      ) * 100,
      100
    );

  const workoutDateSet =
    new Set(
      uniqueWorkoutDates
    );

  let currentStreak = 0;

  const streakDate =
    new Date(now);

  streakDate.setHours(
    0,
    0,
    0,
    0
  );

  if (
    !workoutDateSet.has(
      formatDateKey(streakDate)
    )
  ) {
    streakDate.setDate(
      streakDate.getDate() -
        1
    );
  }

  while (
    workoutDateSet.has(
      formatDateKey(streakDate)
    )
  ) {
    currentStreak += 1;

    streakDate.setDate(
      streakDate.getDate() -
        1
    );
  }

  const analytics = useMemo(() => {
    if (workouts.length === 0) {
      return {
        favoriteExercise: "Not available",
        favoriteExerciseCount: 0,
        longestWorkout: 0,
        averageDuration: 0,
        averageVolume: 0,
        highestVolumeWorkout:
          "Not available",
        highestVolumeAmount: 0,
        highestWeightExercise:
          "Not available",
        highestWeight: 0,
        mostActiveDay:
          "Not available",
      };
    }

    const exerciseCounts = {};
    const dayCounts = {};

    let longestWorkout = 0;
    let highestVolumeAmount = 0;
    let highestVolumeWorkout =
      "Not available";

    let highestWeight = 0;
    let highestWeightExercise =
      "Not available";

    workouts.forEach((workout) => {
      const exercise =
        workout.exerciseName?.trim() ||
        "Other";

      exerciseCounts[exercise] =
        (exerciseCounts[exercise] || 0) +
        1;

      const workoutDate =
        workout.date
          ? new Date(
              `${workout.date}T12:00:00`
            )
          : null;

      if (
        workoutDate &&
        !Number.isNaN(
          workoutDate.getTime()
        )
      ) {
        const dayName =
          workoutDate.toLocaleDateString(
            "en-US",
            {
              weekday: "long",
            }
          );

        dayCounts[dayName] =
          (dayCounts[dayName] || 0) +
          1;
      }

      const duration =
        Number(
          workout.duration || 0
        );

      longestWorkout =
        Math.max(
          longestWorkout,
          duration
        );

      const volume =
        Number(
          workout.sets || 0
        ) *
        Number(
          workout.reps || 0
        ) *
        Number(
          workout.weight || 0
        );

      if (
        volume >
        highestVolumeAmount
      ) {
        highestVolumeAmount =
          volume;

        highestVolumeWorkout =
          workout.workoutName ||
          workout.exerciseName ||
          "Workout";
      }

      const weight =
        Number(
          workout.weight || 0
        );

      if (
        weight >
        highestWeight
      ) {
        highestWeight =
          weight;

        highestWeightExercise =
          workout.exerciseName ||
          "Exercise";
      }
    });

    const favoriteExerciseEntry =
      Object.entries(
        exerciseCounts
      ).sort(
        (
          firstExercise,
          secondExercise
        ) =>
          secondExercise[1] -
          firstExercise[1]
      )[0];

    const mostActiveDayEntry =
      Object.entries(
        dayCounts
      ).sort(
        (
          firstDay,
          secondDay
        ) =>
          secondDay[1] -
          firstDay[1]
      )[0];

    return {
      favoriteExercise:
        favoriteExerciseEntry?.[0] ||
        "Not available",

      favoriteExerciseCount:
        favoriteExerciseEntry?.[1] ||
        0,

      longestWorkout,

      averageDuration:
        Math.round(
          totalDuration /
            workouts.length
        ),

      averageVolume:
        Math.round(
          totalVolume /
            workouts.length
        ),

      highestVolumeWorkout,

      highestVolumeAmount,

      highestWeightExercise,

      highestWeight,

      mostActiveDay:
        mostActiveDayEntry?.[0] ||
        "Not available",
    };
  }, [
    workouts,
    totalDuration,
    totalVolume,
  ]);

  function saveWeeklyGoal(
    event
  ) {
    const newGoal =
      Number(
        event.target.value
      );

    setWeeklyGoal(newGoal);

    if (goalKey) {
      localStorage.setItem(
        goalKey,
        String(newGoal)
      );

      setGoalMessage(
        "Weekly goal updated."
      );

      window.setTimeout(() => {
        setGoalMessage("");
      }, 1800);
    }
  }

  function openDayNote(day) {
    setSelectedDay(day);

    setNoteText(
      calendarNotes[
        day.dateKey
      ] || ""
    );

    setNoteMessage("");
  }

  function closeDayNote() {
    setSelectedDay(null);
    setNoteText("");
    setNoteMessage("");
  }

  function saveDayNote() {
    if (
      !selectedDay ||
      !notesKey
    ) {
      return;
    }

    const updatedNotes = {
      ...calendarNotes,

      [selectedDay.dateKey]:
        noteText.trim(),
    };

    if (!noteText.trim()) {
      delete updatedNotes[
        selectedDay.dateKey
      ];
    }

    localStorage.setItem(
      notesKey,
      JSON.stringify(
        updatedNotes
      )
    );

    setCalendarNotes(
      updatedNotes
    );

    setNoteMessage(
      noteText.trim()
        ? "Note saved successfully."
        : "Empty note removed."
    );
  }

  function deleteDayNote() {
    if (
      !selectedDay ||
      !notesKey
    ) {
      return;
    }

    const updatedNotes = {
      ...calendarNotes,
    };

    delete updatedNotes[
      selectedDay.dateKey
    ];

    localStorage.setItem(
      notesKey,
      JSON.stringify(
        updatedNotes
      )
    );

    setCalendarNotes(
      updatedNotes
    );

    setNoteText("");

    setNoteMessage(
      "Note deleted."
    );
  }

  function getNotePreview(
    note
  ) {
    if (!note) {
      return "";
    }

    return note.length > 42
      ? `${note.slice(
          0,
          42
        )}...`
      : note;
  }

  return (
    <section className="content-page dashboard-page">

      <header className="dashboard-header personalized-header">
        <div className="dashboard-header-text">

          <p className="dashboard-date">
            {today}
          </p>

          <h1>
            {greeting},{" "}
            {userName}!{" "}

            <span aria-hidden="true">
              {greetingEmoji}
            </span>
          </h1>

          <p className="dashboard-motivation">
            Stay consistent. Every workout
            brings you closer to your fitness
            goal.
          </p>
        </div>

        <Link
          to="/add-workout"
          className="dashboard-add-button"
        >
          <span aria-hidden="true">
            ＋
          </span>

          Add Workout
        </Link>
      </header>

      <article className="dashboard-quote-card">
        <div
          className="quote-icon"
          aria-hidden="true"
        >
          {dailyQuote.icon}
        </div>

        <div className="quote-content">
          <span className="quote-label">
            Motivation of the Day
          </span>

          <blockquote>
            “{dailyQuote.text}”
          </blockquote>

          <p>
            — {dailyQuote.author}
          </p>
        </div>

        <div
          className="quote-decoration"
          aria-hidden="true"
        >
          ”
        </div>
      </article>

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">
            🏋️
          </div>

          <div>
            <span>
              Total Workouts
            </span>

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
            <span>
              Total Duration
            </span>

            <strong>
              {totalDuration} min
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon orange">
            🔥
          </div>

          <div>
            <span>
              Calories Burned
            </span>

            <strong>
              {totalCalories.toLocaleString()}{" "}
              kcal
            </strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon purple">
            ★
          </div>

          <div>
            <span>
              Current Streak
            </span>

            <strong>
              {currentStreak}{" "}
              {currentStreak === 1
                ? "day"
                : "days"}
            </strong>
          </div>
        </article>
      </div>

      <section className="dashboard-insights-section">

        <div className="section-heading">
          <h2>
            Fitness Insights
          </h2>

          <p>
            Automatically calculated from
            your workout history.
          </p>
        </div>

        <div className="dashboard-insights-grid">

          <article>
            <span>⭐</span>

            <div>
              <small>
                Favorite Exercise
              </small>

              <strong>
                {
                  analytics.favoriteExercise
                }
              </strong>

              <em>
                {
                  analytics.favoriteExerciseCount
                }{" "}
                time
                {
                  analytics.favoriteExerciseCount ===
                  1
                    ? ""
                    : "s"
                }
              </em>
            </div>
          </article>

          <article>
            <span>⏱️</span>

            <div>
              <small>
                Longest Workout
              </small>

              <strong>
                {
                  analytics.longestWorkout
                }{" "}
                min
              </strong>
            </div>
          </article>

          <article>
            <span>📊</span>

            <div>
              <small>
                Average Duration
              </small>

              <strong>
                {
                  analytics.averageDuration
                }{" "}
                min
              </strong>
            </div>
          </article>

          <article>
            <span>💪</span>

            <div>
              <small>
                Average Volume
              </small>

              <strong>
                {analytics.averageVolume.toLocaleString()}{" "}
                lbs
              </strong>
            </div>
          </article>

          <article>
            <span>🏆</span>

            <div>
              <small>
                Highest Weight
              </small>

              <strong>
                {
                  analytics.highestWeight
                }{" "}
                lbs
              </strong>

              <em>
                {
                  analytics.highestWeightExercise
                }
              </em>
            </div>
          </article>

          <article>
            <span>📅</span>

            <div>
              <small>
                Most Active Day
              </small>

              <strong>
                {
                  analytics.mostActiveDay
                }
              </strong>
            </div>
          </article>
        </div>
      </section>

       <article className="dashboard-card weekly-calendar-card">
        <div className="card-title-row">
          <div>
            <h2>
              Weekly Activity
            </h2>

            <p className="card-subtitle">
              Click any day to add a reminder
              or note.
            </p>
          </div>

          <div className="weekly-calendar-summary">
            <strong>
              {weeklyActiveDays}
            </strong>

            <span>
              active{" "}
              {weeklyActiveDays === 1
                ? "day"
                : "days"}
            </span>
          </div>
        </div>

        <div className="weekly-calendar-grid">
          {weeklyDays.map((day) => (
            <button
              type="button"
              key={day.dateKey}
              onClick={() =>
                openDayNote(day)
              }
              className={[
                "weekly-calendar-day",

                day.isToday
                  ? "today"
                  : "",

                day.hasWorkout
                  ? "completed"
                  : "",

                day.hasNote
                  ? "has-note"
                  : "",
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

              {day.hasWorkout && (
                <div className="calendar-status-icon">
                  ✓
                </div>
              )}

              {day.hasWorkout && (
                <small className="calendar-workout-count">
                  {day.workoutCount}{" "}
                  {day.workoutCount === 1
                    ? "workout"
                    : "workouts"}
                </small>
              )}

              {day.hasWorkout && (
                <small className="calendar-calorie-count">
                  🔥{" "}
                  {day.calories.toLocaleString()}{" "}
                  kcal
                </small>
              )}

              {day.hasNote && (
                <div className="calendar-note-preview">
                  <span aria-hidden="true">
                    📝
                  </span>

                  <p>
                    {getNotePreview(
                      calendarNotes[
                        day.dateKey
                      ]
                    )}
                  </p>
                </div>
              )}

              {!day.hasWorkout &&
                !day.hasNote && (
                  <small className="calendar-empty-message">
                    Add note
                  </small>
                )}
            </button>
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

          <div>
            <span className="calendar-legend-note">
              📝
            </span>
            Saved note
          </div>

          <p>
            {weeklyWorkoutCount} total{" "}
            {weeklyWorkoutCount === 1
              ? "workout"
              : "workouts"}{" "}
            and{" "}
            {weeklyCalories.toLocaleString()}{" "}
            kcal this week
          </p>
        </div>
      </article>

      <div className="dashboard-feature-grid">
        <article className="dashboard-card recent-workouts-card">
          <div className="card-title-row">
            <div>
              <h2>
                Recent Workouts
              </h2>

              <p className="card-subtitle">
                Your latest workout activity.
              </p>
            </div>

            <Link to="/history">
              View all
            </Link>
          </div>

          {recentWorkouts.length === 0 ? (
            <div className="dashboard-empty">
              <div className="empty-state-icon">
                🏃
              </div>

              <h3>
                No workouts recorded yet
              </h3>

              <p>
                Add your first workout to
                begin tracking your progress.
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
              {recentWorkouts.map(
                (workout) => {
                  const workoutCalories =
                    estimateCalories(
                      workout,
                      bodyWeight
                    );

                  return (
                    <div
                      className="recent-workout"
                      key={workout.id}
                    >
                      <div className="recent-icon">
                        🏋️
                      </div>

                      <div className="recent-info">
                        <strong>
                          {
                            workout.workoutName
                          }
                        </strong>

                        <span>
                          {
                            workout.exerciseName
                          }
                        </span>
                      </div>

                      <div className="recent-date">
                        <span>
                          {workout.date}
                        </span>

                        <small>
                          {workout.duration ||
                            0}{" "}
                          min
                        </small>

                        <small className="recent-calories">
                          🔥{" "}
                          {workoutCalories}{" "}
                          kcal
                        </small>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </article>

        <article className="dashboard-card weekly-goal-card">
          <div className="card-title-row">
            <div>
              <h2>
                Weekly Goal
              </h2>

              <p className="card-subtitle">
                Choose a goal from 2 to 7
                active days.
              </p>
            </div>

            <div className="goal-icon">
              🎯
            </div>
          </div>

          <label
            className="weekly-goal-selector"
            htmlFor="weeklyGoal"
          >
            Weekly target

            <select
              id="weeklyGoal"
              value={weeklyGoal}
              onChange={saveWeeklyGoal}
            >
              {[2, 3, 4, 5, 6, 7].map(
                (goal) => (
                  <option
                    key={goal}
                    value={goal}
                  >
                    {goal} days
                  </option>
                )
              )}
            </select>
          </label>

          {goalMessage && (
            <div className="goal-save-message">
              {goalMessage}
            </div>
          )}

          <div className="goal-progress-information">
            <strong>
              {Math.min(
                weeklyActiveDays,
                weeklyGoal
              )}{" "}
              / {weeklyGoal}
            </strong>

            <span>
              active days completed
            </span>
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
            {weeklyActiveDays >=
            weeklyGoal
              ? "🎉 Great job! You completed your weekly goal."
              : `${
                  weeklyGoal -
                  Math.min(
                    weeklyActiveDays,
                    weeklyGoal
                  )
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

          <div className="weekly-calorie-summary">
            <span>
              Calories this week
            </span>

            <strong>
              🔥{" "}
              {weeklyCalories.toLocaleString()}{" "}
              kcal
            </strong>
          </div>

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
            <h2>
              Progress Overview
            </h2>

            <p className="card-subtitle">
              A summary of your fitness
              activity.
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
            <span>
              Total Minutes
            </span>

            <strong>
              {totalDuration}
            </strong>
          </div>

          <div className="dashboard-summary-item">
            <span>
              Pounds Lifted
            </span>

            <strong>
              {totalVolume.toLocaleString()}
            </strong>
          </div>

          <div className="dashboard-summary-item">
            <span>
              Calories Burned
            </span>

            <strong>
              {totalCalories.toLocaleString()}
            </strong>
          </div>

          <div className="dashboard-summary-item">
            <span>
              Weekly Goal
            </span>

            <strong>
              {Math.round(
                weeklyProgress
              )}
              %
            </strong>
          </div>
        </div>
      </article>

      {selectedDay && (
        <div
          className="calendar-note-overlay"
          onClick={closeDayNote}
          role="presentation"
        >
          <section
            className="calendar-note-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-note-title"
          >
            <div className="calendar-note-header">
              <div>
                <span className="calendar-note-date-label">
                  Daily Planner
                </span>

                <h2 id="calendar-note-title">
                  {selectedDay.fullDate}
                </h2>
              </div>

              <button
                type="button"
                className="calendar-note-close"
                onClick={closeDayNote}
                aria-label="Close note window"
              >
                ×
              </button>
            </div>

            {selectedDay.workouts.length > 0 && (
              <div className="calendar-day-workouts">
                <h3>
                  Workouts scheduled
                </h3>

                {selectedDay.workouts.map(
                  (workout) => {
                    const workoutCalories =
                      estimateCalories(
                        workout,
                        bodyWeight
                      );

                    return (
                      <div
                        className="calendar-modal-workout"
                        key={workout.id}
                      >
                        <div>
                          <strong>
                            {
                              workout.workoutName
                            }
                          </strong>

                          <span>
                            {
                              workout.exerciseName
                            }
                          </span>
                        </div>

                        <div className="calendar-modal-workout-stats">
                          <small>
                            {workout.duration ||
                              0}{" "}
                            min
                          </small>

                          <small>
                            🔥{" "}
                            {workoutCalories}{" "}
                            kcal
                          </small>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            <div className="calendar-note-form">
              <label htmlFor="calendarNote">
                Reminder or personal note
              </label>

              <textarea
                id="calendarNote"
                rows="6"
                maxLength="500"
                value={noteText}
                onChange={(event) => {
                  setNoteText(
                    event.target.value
                  );

                  setNoteMessage("");
                }}
                placeholder="Example: Leg day at 6:00 PM, drink more water, or remember to stretch..."
              />

              <div className="calendar-note-character-count">
                {noteText.length} / 500
              </div>
            </div>

            {noteMessage && (
              <div className="calendar-note-message">
                {noteMessage}
              </div>
            )}

            <div className="calendar-note-actions">
              {calendarNotes[
                selectedDay.dateKey
              ] && (
                <button
                  type="button"
                  className="calendar-note-delete"
                  onClick={deleteDayNote}
                >
                  Delete Note
                </button>
              )}

              <button
                type="button"
                className="calendar-note-cancel"
                onClick={closeDayNote}
              >
                Cancel
              </button>

              <button
                type="button"
                className="calendar-note-save"
                onClick={saveDayNote}
              >
                Save Note
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
          