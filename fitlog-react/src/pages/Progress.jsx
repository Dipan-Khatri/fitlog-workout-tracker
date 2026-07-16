import { useMemo, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = [
  "#246cf1",
  "#22a75a",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
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

function getWorkoutDate(workout) {
  const date = new Date(
    workout.date ||
      workout.createdAt
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

function getWorkoutVolume(
  workout
) {
  return (
    Number(
      workout.sets || 0
    ) *
    Number(
      workout.reps || 0
    ) *
    Number(
      workout.weight || 0
    )
  );
}

function estimateCalories(
  workout,
  bodyWeight
) {
  const duration =
    Number(
      workout.duration || 0
    );

  const weight =
    Number(
      bodyWeight || 165
    );

  const workoutName =
    String(
      workout.workoutName || ""
    ).toLowerCase();

  const exerciseName =
    String(
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

function calculateBmi(
  heightInches,
  weightPounds
) {
  const height =
    Number(heightInches);

  const weight =
    Number(weightPounds);

  if (
    height <= 0 ||
    weight <= 0
  ) {
    return null;
  }

  return (
    weight /
      (height * height)
  ) * 703;
}

function getBmiCategory(bmi) {
  if (!bmi) {
    return {
      label: "Not available",
      className: "unknown",
    };
  }

  if (bmi < 18.5) {
    return {
      label: "Underweight",
      className: "underweight",
    };
  }

  if (bmi < 25) {
    return {
      label: "Healthy Weight",
      className: "healthy",
    };
  }

  if (bmi < 30) {
    return {
      label: "Overweight",
      className: "overweight",
    };
  }

  return {
    label: "Obesity Range",
    className: "obesity",
  };
}

function escapeCsvValue(value) {
  const text =
    String(value ?? "");

  return `"${text.replaceAll(
    '"',
    '""'
  )}"`;
}

function downloadFile(
  filename,
  content,
  type
) {
  const blob =
    new Blob(
      [content],
      { type }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;
  link.download = filename;

  document.body.appendChild(
    link
  );

  link.click();
  link.remove();

  URL.revokeObjectURL(
    url
  );
}

function Progress() {
  const currentUserId =
    localStorage.getItem(
      "fitlogCurrentUserId"
    );

  const workoutKey =
    currentUserId
      ? `fitlogWorkouts_${currentUserId}`
      : null;

  let workouts = [];
  let savedUsers = [];

  try {
    workouts =
      workoutKey
        ? JSON.parse(
            localStorage.getItem(
              workoutKey
            )
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
    savedUsers =
      JSON.parse(
        localStorage.getItem(
          "fitlogUsers"
        )
      ) || [];
  } catch (error) {
    console.error(
      "Unable to load users:",
      error
    );

    savedUsers = [];
  }

  const currentUser =
    savedUsers.find(
      (user) =>
        user.id ===
        currentUserId
    );

  const bodyWeight =
    Number(
      currentUser?.weight
    ) || 165;

  const height =
    Number(
      currentUser?.height
    ) || 0;

  const bmi =
    calculateBmi(
      height,
      bodyWeight
    );

  const bmiCategory =
    getBmiCategory(bmi);

  const [exportMessage, setExportMessage] =
    useState("");

  const totalDuration =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.duration || 0
        ),
      0
    );

  const totalSets =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.sets || 0
        ),
      0
    );

  const totalReps =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.reps || 0
        ),
      0
    );

  const totalVolume =
    workouts.reduce(
      (total, workout) =>
        total +
        getWorkoutVolume(
          workout
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

  const highestWeight =
    workouts.reduce(
      (highest, workout) =>
        Math.max(
          highest,
          Number(
            workout.weight || 0
          )
        ),
      0
    );

  const averageDuration =
    workouts.length > 0
      ? Math.round(
          totalDuration /
            workouts.length
        )
      : 0;

  const averageCalories =
    workouts.length > 0
      ? Math.round(
          totalCalories /
            workouts.length
        )
      : 0;

  const averageVolume =
    workouts.length > 0
      ? Math.round(
          totalVolume /
            workouts.length
        )
      : 0;

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

  function calculateCurrentStreak() {
    const workoutDateSet =
      new Set(
        uniqueWorkoutDates
      );

    let streak = 0;

    const currentDate =
      new Date();

    currentDate.setHours(
      0,
      0,
      0,
      0
    );

    if (
      !workoutDateSet.has(
        formatDateKey(
          currentDate
        )
      )
    ) {
      currentDate.setDate(
        currentDate.getDate() -
          1
      );
    }

    while (
      workoutDateSet.has(
        formatDateKey(
          currentDate
        )
      )
    ) {
      streak += 1;

      currentDate.setDate(
        currentDate.getDate() -
          1
      );
    }

    return streak;
  }

  const currentStreak =
    calculateCurrentStreak();

  const weeklyChartData = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date();

        date.setHours(
          0,
          0,
          0,
          0
        );

        date.setDate(
          date.getDate() -
            (6 - index)
        );

        const dateKey =
          formatDateKey(date);

        const dailyWorkouts =
          workouts.filter(
            (workout) =>
              workout.date ===
              dateKey
          );

        const duration =
          dailyWorkouts.reduce(
            (total, workout) =>
              total +
              Number(
                workout.duration ||
                  0
              ),
            0
          );

        const volume =
          dailyWorkouts.reduce(
            (total, workout) =>
              total +
              getWorkoutVolume(
                workout
              ),
            0
          );

        const calories =
          dailyWorkouts.reduce(
            (total, workout) =>
              total +
              estimateCalories(
                workout,
                bodyWeight
              ),
            0
          );

        return {
          date: dateKey,

          day:
            date.toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),

          workouts:
            dailyWorkouts.length,

          duration,

          volume,

          calories,
        };
      }
    );
  }, [
    workouts,
    bodyWeight,
  ]);

  const volumeTrendData =
    useMemo(() => {
      return Array.from(
        { length: 6 },
        (_, index) => {
          const endDate =
            new Date();

          endDate.setHours(
            23,
            59,
            59,
            999
          );

          endDate.setDate(
            endDate.getDate() -
              (5 - index) * 7
          );

          const startDate =
            new Date(endDate);

          startDate.setDate(
            endDate.getDate() -
              6
          );

          startDate.setHours(
            0,
            0,
            0,
            0
          );

          const weeklyWorkouts =
            workouts.filter(
              (workout) => {
                const workoutDate =
                  getWorkoutDate(
                    workout
                  );

                return (
                  workoutDate &&
                  workoutDate >=
                    startDate &&
                  workoutDate <=
                    endDate
                );
              }
            );

          const volume =
            weeklyWorkouts.reduce(
              (total, workout) =>
                total +
                getWorkoutVolume(
                  workout
                ),
              0
            );

          const duration =
            weeklyWorkouts.reduce(
              (total, workout) =>
                total +
                Number(
                  workout.duration ||
                    0
                ),
              0
            );

          const calories =
            weeklyWorkouts.reduce(
              (total, workout) =>
                total +
                estimateCalories(
                  workout,
                  bodyWeight
                ),
              0
            );

          return {
            week: `Week ${
              index + 1
            }`,

            volume,

            duration,

            calories,

            workouts:
              weeklyWorkouts.length,
          };
        }
      );
    }, [
      workouts,
      bodyWeight,
    ]);

  const exerciseDistribution =
    useMemo(() => {
      const counts = {};

      workouts.forEach(
        (workout) => {
          const exercise =
            workout.exerciseName
              ?.trim() ||
            "Other";

          counts[exercise] =
            (counts[exercise] ||
              0) + 1;
        }
      );

      return Object.entries(
        counts
      )
        .map(
          ([name, value]) => ({
            name,
            value,
          })
        )
        .sort(
          (
            firstExercise,
            secondExercise
          ) =>
            secondExercise.value -
            firstExercise.value
        )
        .slice(0, 6);
    }, [workouts]);

  const favoriteExercise =
    exerciseDistribution.length >
    0
      ? exerciseDistribution[0]
          .name
      : "Not available";

  const exerciseRecords =
    useMemo(() => {
      const records = {};

      workouts.forEach(
        (workout) => {
          const exercise =
            workout.exerciseName
              ?.trim();

          if (!exercise) {
            return;
          }

          const weight =
            Number(
              workout.weight ||
                0
            );

          const volume =
            getWorkoutVolume(
              workout
            );

          if (
            !records[
              exercise
            ]
          ) {
            records[exercise] = {
              exercise,
              weight,
              volume,
              date:
                workout.date ||
                "No date",
            };

            return;
          }

          if (
            weight >
            records[exercise]
              .weight
          ) {
            records[exercise] = {
              exercise,
              weight,
              volume,
              date:
                workout.date ||
                "No date",
            };
          }
        }
      );

      return Object.values(
        records
      )
        .sort(
          (
            firstRecord,
            secondRecord
          ) =>
            secondRecord.weight -
            firstRecord.weight
        )
        .slice(0, 6);
    }, [workouts]);

  const highestVolumeWorkout =
    useMemo(() => {
      if (
        workouts.length === 0
      ) {
        return null;
      }

      return [
        ...workouts,
      ]
        .map(
          (workout) => ({
            ...workout,

            calculatedVolume:
              getWorkoutVolume(
                workout
              ),
          })
        )
        .sort(
          (
            firstWorkout,
            secondWorkout
          ) =>
            secondWorkout.calculatedVolume -
            firstWorkout.calculatedVolume
        )[0];
    }, [workouts]);

  const longestWorkout =
    useMemo(() => {
      if (
        workouts.length === 0
      ) {
        return null;
      }

      return [
        ...workouts,
      ].sort(
        (
          firstWorkout,
          secondWorkout
        ) =>
          Number(
            secondWorkout.duration ||
              0
          ) -
          Number(
            firstWorkout.duration ||
              0
          )
      )[0];
    }, [workouts]);

  function showExportMessage(
    message
  ) {
    setExportMessage(
      message
    );

    window.setTimeout(() => {
      setExportMessage("");
    }, 2000);
  }

  function exportCsv() {
    if (
      workouts.length === 0
    ) {
      showExportMessage(
        "Add a workout before exporting."
      );

      return;
    }

    const headers = [
      "Workout Name",
      "Date",
      "Exercise",
      "Duration",
      "Sets",
      "Reps",
      "Weight",
      "Volume",
      "Estimated Calories",
      "Notes",
    ];

    const rows =
      workouts.map(
        (workout) => {
          return [
            workout.workoutName,
            workout.date,
            workout.exerciseName,
            workout.duration,
            workout.sets,
            workout.reps,
            workout.weight,
            getWorkoutVolume(
              workout
            ),
            estimateCalories(
              workout,
              bodyWeight
            ),
            workout.notes,
          ]
            .map(
              escapeCsvValue
            )
            .join(",");
        }
      );

    const csvContent = [
      headers
        .map(
          escapeCsvValue
        )
        .join(","),

      ...rows,
    ].join("\n");

    downloadFile(
      `fitlog-progress-${formatDateKey(
        new Date()
      )}.csv`,
      csvContent,
      "text/csv;charset=utf-8"
    );

    showExportMessage(
      "CSV file downloaded."
    );
  }

  function exportJson() {
    if (
      workouts.length === 0
    ) {
      showExportMessage(
        "Add a workout before exporting."
      );

      return;
    }

    const exportData =
      workouts.map(
        (workout) => ({
          ...workout,

          volume:
            getWorkoutVolume(
              workout
            ),

          estimatedCalories:
            estimateCalories(
              workout,
              bodyWeight
            ),
        })
      );

    downloadFile(
      `fitlog-progress-${formatDateKey(
        new Date()
      )}.json`,
      JSON.stringify(
        exportData,
        null,
        2
      ),
      "application/json"
    );

    showExportMessage(
      "JSON file downloaded."
    );
  }
  const achievementDefinitions = [
    {
      id: "first-workout",
      title: "First Workout",
      description:
        "Complete your first workout.",
      icon: "🏅",
      unlocked:
        workouts.length >= 1,
      progress:
        Math.min(
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
      unlocked:
        workouts.length >= 5,
      progress:
        Math.min(
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
      unlocked:
        workouts.length >= 10,
      progress:
        Math.min(
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
      unlocked:
        totalVolume >= 1000,
      progress:
        Math.min(
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
      unlocked:
        totalVolume >= 5000,
      progress:
        Math.min(
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
      unlocked:
        currentStreak >= 3,
      progress:
        Math.min(
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
      unlocked:
        currentStreak >= 7,
      progress:
        Math.min(
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
      unlocked:
        totalDuration >= 300,
      progress:
        Math.min(
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
      id: "two-thousand-calories",
      title: "Calorie Crusher",
      description:
        "Burn an estimated 2,000 calories.",
      icon: "🔥",
      unlocked:
        totalCalories >= 2000,
      progress:
        Math.min(
          totalCalories,
          2000
        ),
      goal: 2000,
      progressLabel: `${Math.min(
        totalCalories,
        2000
      ).toLocaleString()} / 2,000 kcal`,
    },
    {
      id: "one-thousand-reps",
      title: "Rep Machine",
      description:
        "Complete 1,000 total repetitions.",
      icon: "🚀",
      unlocked:
        totalReps >= 1000,
      progress:
        Math.min(
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

/* ==========================================
   WORKOUT HEATMAP
========================================== */

const last30Days = [];

for (let i = 29; i >= 0; i--) {
  const date = new Date();

  date.setDate(date.getDate() - i);

  const key = date.toISOString().split("T")[0];

  const count = workouts.filter(
    (workout) => workout.date === key
  ).length;

  last30Days.push({
    date: key,
    workouts: count,
  });
}


  const completionPercentage =
    achievementDefinitions.length > 0
      ? Math.round(
          (
            unlockedAchievements.length /
            achievementDefinitions.length
          ) * 100
        )
      : 0;

  return (
    <section className="content-page progress-page">
      <header className="page-title progress-page-header">
        <div>
          <p className="page-eyebrow">
            Fitness Analytics
          </p>

          <h1>
            Progress & Achievements
          </h1>

          <p>
            Explore your workout trends,
            calories, records, milestones,
            and health summary.
          </p>
        </div>

        <div className="progress-export-actions">
          <button
            type="button"
            onClick={exportCsv}
          >
            ⬇ Export CSV
          </button>

          <button
            type="button"
            onClick={exportJson}
          >
            ⬇ Export JSON
          </button>
        </div>
      </header>

      {exportMessage && (
        <div className="export-message">
          {exportMessage}
        </div>
      )}
      {/* WEEKLY GOAL TRACKER */}

      {(() => {
        const weeklyGoal =
          Number(
            localStorage.getItem(
              `fitlogWeeklyGoal_${currentUserId}`
            )
          ) || 5;

        const today = new Date();

        const firstDay = new Date(today);

        firstDay.setDate(
          today.getDate() - today.getDay()
        );

        const workoutsThisWeek =
          workouts.filter((workout) => {
            if (!workout.date) return false;

            return (
              new Date(workout.date) >= firstDay
            );
          }).length;

        const progress =
          Math.min(
            (workoutsThisWeek / weeklyGoal) *
              100,
            100
          );

        return (
          <section className="weekly-goal-card">
            <div className="weekly-goal-header">
              <div>
                <h2>
                  🎯 Weekly Goal
                </h2>

                <p>
                  Stay consistent every
                  week.
                </p>
              </div>

              <strong>
                {workoutsThisWeek}/
                {weeklyGoal}
              </strong>
            </div>

            <div className="weekly-goal-progress">
              <div
                className="weekly-goal-fill"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="weekly-goal-message">
              {workoutsThisWeek >=
              weeklyGoal
                ? "🎉 Weekly goal completed!"
                : `${weeklyGoal - workoutsThisWeek} workout(s) remaining this week.`}
            </p>
          </section>
        );
      })()}
      

      <div className="stat-grid">
        <article className="stat-card">
          <div className="stat-icon blue">
            🏋️
          </div>

          <div>
            <span>
              Workouts
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
            ↑
          </div>

          <div>
            <span>
              Highest Weight
            </span>

            <strong>
              {highestWeight} lbs
            </strong>
          </div>
        </article>
      </div>

      <section className="progress-health-grid">
        <article className="progress-health-card">
          <span className="progress-health-icon">
            ⚖️
          </span>

          <div>
            <small>
              Current BMI
            </small>

            <strong>
              {bmi
                ? bmi.toFixed(1)
                : "—"}
            </strong>

            <em
              className={`progress-bmi-badge ${bmiCategory.className}`}
            >
              {bmiCategory.label}
            </em>
          </div>
        </article>

        <article className="progress-health-card">
          <span className="progress-health-icon">
            🔥
          </span>

          <div>
            <small>
              Average Calories
            </small>

            <strong>
              {averageCalories} kcal
            </strong>

            <em>
              per workout
            </em>
          </div>
        </article>

        <article className="progress-health-card">
          <span className="progress-health-icon">
            💪
          </span>

          <div>
            <small>
              Average Volume
            </small>

            <strong>
              {averageVolume.toLocaleString()}{" "}
              lbs
            </strong>

            <em>
              per workout
            </em>
          </div>
        </article>

        <article className="progress-health-card">
          <span className="progress-health-icon">
            ⭐
          </span>

          <div>
            <small>
              Favorite Exercise
            </small>

            <strong>
              {favoriteExercise}
            </strong>

            <em>
              most recorded
            </em>
          </div>
        </article>
      </section>
    
      {workouts.length === 0 ? (
        <div className="progress-empty-state">
          <div>📊</div>

          <h2>
            No chart data available yet
          </h2>

          <p>
            Add workouts to begin generating
            personalized charts, calorie
            estimates, and fitness analytics.
          </p>
        </div>
      ) : (
        <>
          <section className="progress-chart-grid">
            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>
                    Weekly Activity
                  </h2>

                  <p>
                    Workouts completed during
                    the last seven days.
                  </p>
                </div>

                <span className="chart-badge">
                  7 days
                </span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={weeklyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      cursor={{
                        fill:
                          "rgba(36, 108, 241, 0.06)",
                      }}
                      contentStyle={{
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #dce6f2",
                      }}
                    />

                    <Bar
                      dataKey="workouts"
                      name="Workouts"
                      fill="#246cf1"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>
                    Volume Trend
                  </h2>

                  <p>
                    Total weight volume over
                    the last six weeks.
                  </p>
                </div>

                <span className="chart-badge">
                  6 weeks
                </span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={volumeTrendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="volumeGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#246cf1"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#246cf1"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${Number(
                          value
                        ).toLocaleString()} lbs`,
                        "Volume",
                      ]}
                      contentStyle={{
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #dce6f2",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="volume"
                      name="Volume"
                      stroke="#246cf1"
                      strokeWidth={3}
                      fill="url(#volumeGradient)"
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="progress-chart-grid secondary">
            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>
                    Workout Duration
                  </h2>

                  <p>
                    Minutes trained during
                    the last seven days.
                  </p>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={weeklyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${value} minutes`,
                        "Duration",
                      ]}
                      contentStyle={{
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #dce6f2",
                      }}
                    />

                    <Bar
                      dataKey="duration"
                      name="Duration"
                      fill="#22a75a"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>
                    Calories Burned
                  </h2>

                  <p>
                    Estimated calories during
                    the last seven days.
                  </p>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={weeklyChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${Number(
                          value
                        ).toLocaleString()} kcal`,
                        "Calories",
                      ]}
                      contentStyle={{
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #dce6f2",
                      }}
                    />

                    <Bar
                      dataKey="calories"
                      name="Calories"
                      fill="#f59e0b"
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          <section className="progress-chart-grid secondary">
            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>
                    Exercise Distribution
                  </h2>

                  <p>
                    Your most frequently
                    recorded exercises.
                  </p>
                </div>
              </div>

              {exerciseDistribution.length ===
              0 ? (
                <div className="chart-empty-message">
                  No exercise data available.
                </div>
              ) : (
                <div className="chart-container pie-chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          exerciseDistribution
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {exerciseDistribution.map(
                          (
                            entry,
                            index
                          ) => (
                            <Cell
                              key={
                                entry.name
                              }
                              fill={
                                chartColors[
                                  index %
                                    chartColors.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip
                        formatter={(
                          value
                        ) => [
                          `${value} workout${
                            value === 1
                              ? ""
                              : "s"
                          }`,
                          "Recorded",
                        ]}
                        contentStyle={{
                          borderRadius:
                            "12px",
                          border:
                            "1px solid #dce6f2",
                        }}
                      />

                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{
                          fontSize:
                            "12px",
                          color:
                            "#71809a",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>

            <article className="progress-chart-card">
              <div className="chart-card-header">
                <div>
                  <h2>
                    Six-Week Calories
                  </h2>

                  <p>
                    Estimated calorie trend
                    across six weeks.
                  </p>
                </div>

                <span className="chart-badge">
                  6 weeks
                </span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={volumeTrendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -10,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="calorieGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e5ebf3"
                    />

                    <XAxis
                      dataKey="week"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fill: "#71809a",
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(
                        value
                      ) => [
                        `${Number(
                          value
                        ).toLocaleString()} kcal`,
                        "Calories",
                      ]}
                      contentStyle={{
                        borderRadius:
                          "12px",
                        border:
                          "1px solid #dce6f2",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="calories"
                      name="Calories"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fill="url(#calorieGradient)"
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>
        </>
      )}
      <section className="workout-heatmap-section">
        <div className="heatmap-header">
          <div>
            <h2>30-Day Workout Activity</h2>

            <p>
              Your workout consistency during the last
              30 days.
            </p>
          </div>

          <div className="heatmap-total">
            <strong>
              {last30Days.reduce(
                (total, day) =>
                  total + day.workouts,
                0
              )}
            </strong>

            <span>workouts</span>
          </div>
        </div>

        <div className="workout-heatmap-grid">
          {last30Days.map((day) => {
            let activityLevel = "empty";

            if (day.workouts === 1) {
              activityLevel = "low";
            }

            if (day.workouts === 2) {
              activityLevel = "medium";
            }

            if (day.workouts >= 3) {
              activityLevel = "high";
            }

            const formattedDate =
              new Date(
                `${day.date}T12:00:00`
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              );

            return (
              <div
                key={day.date}
                className={`heatmap-day ${activityLevel}`}
                title={`${formattedDate}: ${
                  day.workouts
                } ${
                  day.workouts === 1
                    ? "workout"
                    : "workouts"
                }`}
              >
                <span>
                  {
                    new Date(
                      `${day.date}T12:00:00`
                    ).getDate()
                  }
                </span>

                {day.workouts > 0 && (
                  <small>
                    {day.workouts}
                  </small>
                )}
              </div>
            );
          })}
        </div>

        <div className="heatmap-footer">
          <span>Less</span>

          <div className="heatmap-legend">
            <i className="empty" />
            <i className="low" />
            <i className="medium" />
            <i className="high" />
          </div>

          <span>More</span>
        </div>
      </section>

      <section className="personal-records-section">
        <div className="section-heading">
          <h2>
            Personal Records
          </h2>

          <p>
            Your strongest exercises and
            best workout results.
          </p>
        </div>

        <div className="personal-record-grid">
          <article>
            <span>🏋️</span>

            <div>
              <small>
                Highest Weight
              </small>

              <strong>
                {highestWeight} lbs
              </strong>
            </div>
          </article>

          <article>
            <span>⏱️</span>

            <div>
              <small>
                Average Duration
              </small>

              <strong>
                {averageDuration} min
              </strong>
            </div>
          </article>

          <article>
            <span>🔥</span>

            <div>
              <small>
                Current Streak
              </small>

              <strong>
                {currentStreak}{" "}
                {currentStreak === 1
                  ? "day"
                  : "days"}
              </strong>
            </div>
          </article>

          <article>
            <span>⭐</span>

            <div>
              <small>
                Favorite Exercise
              </small>

              <strong>
                {favoriteExercise}
              </strong>
            </div>
          </article>
        </div>

        <div className="progress-highlight-grid">
          <article className="progress-highlight-card volume">
            <span>
              ⚡ Highest-Volume Session
            </span>

            <strong>
              {highestVolumeWorkout
                ? highestVolumeWorkout.workoutName ||
                  "Workout"
                : "Not available"}
            </strong>

            <p>
              {highestVolumeWorkout
                ? `${highestVolumeWorkout.calculatedVolume.toLocaleString()} lbs total volume`
                : "Add workouts to create this record."}
            </p>
          </article>

          <article className="progress-highlight-card duration">
            <span>
              ⏱️ Longest Session
            </span>

            <strong>
              {longestWorkout
                ? longestWorkout.workoutName ||
                  "Workout"
                : "Not available"}
            </strong>

            <p>
              {longestWorkout
                ? `${Number(
                    longestWorkout.duration ||
                      0
                  )} minutes`
                : "Add workouts to create this record."}
            </p>
          </article>

          <article className="progress-highlight-card calories">
            <span>
              🔥 Average Calories
            </span>

            <strong>
              {averageCalories} kcal
            </strong>

            <p>
              Estimated calories burned per
              workout.
            </p>
          </article>
        </div>

        <div className="exercise-records-header">
          <div>
            <h3>
              Exercise Personal Records
            </h3>

            <p>
              Highest weight recorded for each
              exercise.
            </p>
          </div>

          <span>
            {exerciseRecords.length} records
          </span>
        </div>

        {exerciseRecords.length === 0 ? (
          <div className="no-records-message">
            Add weighted exercises to create
            personal records.
          </div>
        ) : (
          <div className="exercise-pr-grid">
            {exerciseRecords.map(
              (record) => (
                <article
                  key={record.exercise}
                  className="exercise-pr-card"
                >
                  <div className="exercise-pr-icon">
                    🏆
                  </div>

                  <div>
                    <span>
                      {record.exercise} PR
                    </span>

                    <strong>
                      {record.weight} lbs
                    </strong>

                    <small>
                      Recorded on{" "}
                      {record.date}
                    </small>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      <section className="achievement-section">
        <div className="section-heading">
          <h2>Achievements</h2>

          <p>
            Unlock milestones as you continue
            your fitness journey.
          </p>
        </div>

        <div className="achievement-overview">
          <div>
            <strong>
              {unlockedAchievements.length}
            </strong>

            <span>
              of {achievementDefinitions.length} unlocked
            </span>
          </div>

          <div className="achievement-progress-bar">
            <div
              className="achievement-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          <strong>
            {completionPercentage}%
          </strong>
        </div>

        <div className="achievement-grid">
          {achievementDefinitions.map(
            (achievement) => {
              const progressPercent =
                Math.min(
                  (achievement.progress /
                    achievement.goal) *
                    100,
                  100
                );

              return (
                <article
                  key={achievement.id}
                  className={`achievement-card ${
                    achievement.unlocked
                      ? "unlocked"
                      : "locked"
                  }`}
                >
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>

                  <div className="achievement-content">
                    <h3>
                      {achievement.title}
                    </h3>

                    <p>
                      {achievement.description}
                    </p>

                    <small>
                      {achievement.progressLabel}
                    </small>

                    <div className="achievement-progress">
                      <div
                        className="achievement-progress-value"
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="achievement-status">
                    {achievement.unlocked
                      ? "Unlocked"
                      : "Locked"}
                  </div>
                </article>
              );
            }
          )}
        </div>
      </section>
    </section>
  );
}

export default Progress;
