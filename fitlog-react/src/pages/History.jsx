 import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function estimateCalories(
  workout,
  bodyWeight
) {
  const duration =
    Number(
      workout.duration || 0
    );

  const weight =
    Number(bodyWeight || 165);

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

function getWorkoutDifficulty(
  workout
) {
  const duration =
    Number(
      workout.duration || 0
    );

  const volume =
    getWorkoutVolume(
      workout
    );

  if (
    duration >= 75 ||
    volume >= 8000
  ) {
    return {
      label: "Hard",
      className: "hard",
      icon: "🔴",
    };
  }

  if (
    duration >= 45 ||
    volume >= 3000
  ) {
    return {
      label: "Medium",
      className: "medium",
      icon: "🟡",
    };
  }

  return {
    label: "Easy",
    className: "easy",
    icon: "🟢",
  };
}

function getWorkoutCategory(
  workout
) {
  const combinedText =
    `${workout.workoutName || ""} ${
      workout.exerciseName || ""
    }`.toLowerCase();

  if (
    combinedText.includes("run") ||
    combinedText.includes("cardio") ||
    combinedText.includes("cycling")
  ) {
    return {
      label: "Cardio",
      icon: "🏃",
      className: "cardio",
    };
  }

  if (
    combinedText.includes("leg") ||
    combinedText.includes("squat") ||
    combinedText.includes("lunge")
  ) {
    return {
      label: "Legs",
      icon: "🦵",
      className: "legs",
    };
  }

  if (
    combinedText.includes("chest") ||
    combinedText.includes("bench")
  ) {
    return {
      label: "Chest",
      icon: "💪",
      className: "chest",
    };
  }

  if (
    combinedText.includes("back") ||
    combinedText.includes("row") ||
    combinedText.includes("pull")
  ) {
    return {
      label: "Back",
      icon: "🏋️",
      className: "back",
    };
  }

  if (
    combinedText.includes("full body") ||
    combinedText.includes("circuit")
  ) {
    return {
      label: "Full Body",
      icon: "🔥",
      className: "full-body",
    };
  }

  return {
    label: "Strength",
    icon: "⚡",
    className: "strength",
  };
}

function escapeCsvValue(
  value
) {
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

function History() {
  const navigate =
    useNavigate();

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

  const [searchTerm, setSearchTerm] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [sortOrder, setSortOrder] =
    useState("newest");

  const [
    exportMessage,
    setExportMessage,
  ] = useState("");

  function getWorkoutDate(
    workout
  ) {
    const value =
      workout.date ||
      workout.createdAt;

    if (!value) {
      return null;
    }

    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? null
      : date;
  }

  function isThisWeek(
    date
  ) {
    if (!date) {
      return false;
    }

    const now =
      new Date();

    const currentDay =
      now.getDay();

    const mondayDifference =
      currentDay === 0
        ? -6
        : 1 - currentDay;

    const startOfWeek =
      new Date(now);

    startOfWeek.setDate(
      now.getDate() +
        mondayDifference
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    const endOfWeek =
      new Date(startOfWeek);

    endOfWeek.setDate(
      startOfWeek.getDate() +
        7
    );

    return (
      date >= startOfWeek &&
      date < endOfWeek
    );
  }

  function isThisMonth(
    date
  ) {
    if (!date) {
      return false;
    }

    const now =
      new Date();

    return (
      date.getFullYear() ===
        now.getFullYear() &&
      date.getMonth() ===
        now.getMonth()
    );
  }

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
  const personalRecords = useMemo(() => {
    const records = {};

    workouts.forEach((workout) => {
      const exerciseName =
        workout.exerciseName?.trim();

      if (!exerciseName) {
        return;
      }

      const currentWeight =
        Number(workout.weight || 0);

      if (
        !records[exerciseName] ||
        currentWeight >
          records[exerciseName]
      ) {
        records[exerciseName] =
          currentWeight;
      }
    });

    return records;
  }, [workouts]);

  const filteredWorkouts =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      const matchingWorkouts =
        workouts.filter(
          (workout) => {
            const workoutName =
              String(
                workout.workoutName ||
                  ""
              ).toLowerCase();

            const exerciseName =
              String(
                workout.exerciseName ||
                  ""
              ).toLowerCase();

            const notes =
              String(
                workout.notes || ""
              ).toLowerCase();

            const category =
              getWorkoutCategory(
                workout
              );

            const matchesSearch =
              !normalizedSearch ||
              workoutName.includes(
                normalizedSearch
              ) ||
              exerciseName.includes(
                normalizedSearch
              ) ||
              notes.includes(
                normalizedSearch
              );

            const workoutDate =
              getWorkoutDate(
                workout
              );

            let matchesDate = true;

            if (
              dateFilter === "week"
            ) {
              matchesDate =
                isThisWeek(
                  workoutDate
                );
            }

            if (
              dateFilter === "month"
            ) {
              matchesDate =
                isThisMonth(
                  workoutDate
                );
            }

            const matchesCategory =
              categoryFilter ===
                "all" ||
              category.className ===
                categoryFilter;

            return (
              matchesSearch &&
              matchesDate &&
              matchesCategory
            );
          }
        );

      return [
        ...matchingWorkouts,
      ].sort(
        (
          firstWorkout,
          secondWorkout
        ) => {
          const firstDate =
            getWorkoutDate(
              firstWorkout
            )?.getTime() || 0;

          const secondDate =
            getWorkoutDate(
              secondWorkout
            )?.getTime() || 0;

          if (
            sortOrder === "oldest"
          ) {
            return (
              firstDate -
              secondDate
            );
          }

          if (
            sortOrder === "name"
          ) {
            return String(
              firstWorkout.workoutName ||
                ""
            ).localeCompare(
              String(
                secondWorkout.workoutName ||
                  ""
              )
            );
          }

          if (
            sortOrder ===
            "highest-weight"
          ) {
            return (
              Number(
                secondWorkout.weight ||
                  0
              ) -
              Number(
                firstWorkout.weight ||
                  0
              )
            );
          }

          if (
            sortOrder ===
            "highest-volume"
          ) {
            return (
              getWorkoutVolume(
                secondWorkout
              ) -
              getWorkoutVolume(
                firstWorkout
              )
            );
          }

          if (
            sortOrder ===
            "longest"
          ) {
            return (
              Number(
                secondWorkout.duration ||
                  0
              ) -
              Number(
                firstWorkout.duration ||
                  0
              )
            );
          }

          if (
            sortOrder ===
            "calories"
          ) {
            return (
              estimateCalories(
                secondWorkout,
                bodyWeight
              ) -
              estimateCalories(
                firstWorkout,
                bodyWeight
              )
            );
          }

          return (
            secondDate -
            firstDate
          );
        }
      );
    }, [
      workouts,
      searchTerm,
      dateFilter,
      categoryFilter,
      sortOrder,
      bodyWeight,
    ]);

  const totalDuration =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.duration || 0
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

  function clearFilters() {
    setSearchTerm("");
    setDateFilter("all");
    setCategoryFilter("all");
    setSortOrder("newest");
  }

  const filtersAreActive =
    searchTerm.trim() ||
    dateFilter !== "all" ||
    categoryFilter !== "all" ||
    sortOrder !== "newest";

  function exportCsv() {
    if (
      filteredWorkouts.length ===
      0
    ) {
      showExportMessage(
        "No workouts available to export."
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
      "Calories",
      "Notes",
    ];

    const rows =
      filteredWorkouts.map(
        (workout) => {
          const volume =
            getWorkoutVolume(
              workout
            );

          const calories =
            estimateCalories(
              workout,
              bodyWeight
            );

          return [
            workout.workoutName,
            workout.date,
            workout.exerciseName,
            workout.duration,
            workout.sets,
            workout.reps,
            workout.weight,
            volume,
            calories,
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
      `fitlog-history-${formatDateKey(
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
      filteredWorkouts.length ===
      0
    ) {
      showExportMessage(
        "No workouts available to export."
      );

      return;
    }

    const exportData =
      filteredWorkouts.map(
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

          difficulty:
            getWorkoutDifficulty(
              workout
            ).label,

          category:
            getWorkoutCategory(
              workout
            ).label,
        })
      );

    downloadFile(
      `fitlog-history-${formatDateKey(
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

  return (
    <section className="content-page history-page">
      <header className="history-header upgraded-history-header">
        <div>
          <p className="page-eyebrow">
            Workout Management
          </p>

          <h1>
            Workout History
          </h1>

          <p>
            Search, filter, export, and
            review your saved workout
            sessions.
          </p>
        </div>

        <div className="history-header-actions">
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

          <Link
            to="/add-workout"
            className="primary-link"
          >
            + Add Workout
          </Link>
        </div>
      </header>

      {exportMessage && (
        <div className="history-export-message">
          {exportMessage}
        </div>
      )}

      <section className="history-summary-grid">
        <article>
          <span>🏋️</span>

          <div>
            <small>
              Total Workouts
            </small>

            <strong>
              {workouts.length}
            </strong>
          </div>
        </article>

        <article>
          <span>🔥</span>

          <div>
            <small>
              Total Calories
            </small>

            <strong>
              {totalCalories.toLocaleString()}{" "}
              kcal
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
          <span>🏆</span>

          <div>
            <small>
              Highest Weight
            </small>

            <strong>
              {highestWeight} lbs
            </strong>
          </div>
        </article>
      </section>

      <section className="history-filter-card upgraded-history-filter-card">
        <div className="history-search-group">
          <label htmlFor="workoutSearch">
            Search workouts
          </label>

          <div className="history-search-input">
            <span aria-hidden="true">⌕</span>

            <input
              id="workoutSearch"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search workout, exercise, or notes"
            />
          </div>
        </div>

        <div className="history-filter-group">
          <label htmlFor="dateFilter">
            Date range
          </label>

          <select
            id="dateFilter"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
          >
            <option value="all">
              All workouts
            </option>

            <option value="week">
              This week
            </option>

            <option value="month">
              This month
            </option>
          </select>
        </div>

        <div className="history-filter-group">
          <label htmlFor="categoryFilter">
            Category
          </label>

          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All categories
            </option>

            <option value="chest">
              Chest
            </option>

            <option value="back">
              Back
            </option>

            <option value="legs">
              Legs
            </option>

            <option value="cardio">
              Cardio
            </option>

            <option value="full-body">
              Full Body
            </option>

            <option value="strength">
              Strength
            </option>
          </select>
        </div>

        <div className="history-filter-group">
          <label htmlFor="sortOrder">
            Sort by
          </label>

          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
          >
            <option value="newest">
              Newest first
            </option>

            <option value="oldest">
              Oldest first
            </option>

            <option value="name">
              Workout name
            </option>

            <option value="highest-weight">
              Highest weight
            </option>

            <option value="highest-volume">
              Highest volume
            </option>

            <option value="longest">
              Longest workout
            </option>

            <option value="calories">
              Calories burned
            </option>
          </select>
        </div>

        <button
          type="button"
          className="clear-history-filters"
          onClick={clearFilters}
          disabled={!filtersAreActive}
        >
          Clear Filters
        </button>
      </section>

      <div className="history-results-row">
        <p>
          Showing{" "}
          <strong>
            {filteredWorkouts.length}
          </strong>{" "}
          of{" "}
          <strong>
            {workouts.length}
          </strong>{" "}
          workouts
        </p>

        {filtersAreActive && (
          <span>
            Filters applied
          </span>
        )}
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state history-empty-state">
          <div className="history-empty-icon">
            🏋️
          </div>

          <h2>
            No workouts recorded yet
          </h2>

          <p>
            Add your first workout to begin
            tracking your fitness journey.
          </p>

          <Link
            to="/add-workout"
            className="primary-link"
          >
            Add Workout
          </Link>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="empty-state history-empty-state">
          <div className="history-empty-icon">
            🔍
          </div>

          <h2>
            No matching workouts
          </h2>

          <p>
            Try changing your search term or
            removing one of the filters.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="history-card-list">
          {filteredWorkouts.map(
            (workout) => {
              const workoutVolume =
                getWorkoutVolume(
                  workout
                );

              const workoutCalories =
                estimateCalories(
                  workout,
                  bodyWeight
                );

              const difficulty =
                getWorkoutDifficulty(
                  workout
                );

              const category =
                getWorkoutCategory(
                  workout
                );

              const exerciseName =
                workout.exerciseName?.trim() ||
                "";

              const isPersonalRecord =
                exerciseName &&
                Number(
                  workout.weight || 0
                ) > 0 &&
                Number(
                  workout.weight || 0
                ) ===
                  personalRecords[
                    exerciseName
                  ];

              return (
                <article
                  className={`history-workout-card category-${category.className}`}
                  key={workout.id}
                >
                  <div className="history-card-accent" />

                  <div className="history-workout-icon">
                    {category.icon}
                  </div>

                  <div className="history-workout-main">
                    <div className="history-workout-title-row">
                      <div>
                        <div className="history-card-badges">
                          <span
                            className={`history-category-badge ${category.className}`}
                          >
                            {category.label}
                          </span>

                          <span
                            className={`history-difficulty-badge ${difficulty.className}`}
                          >
                            {difficulty.icon}{" "}
                            {difficulty.label}
                          </span>

                          {isPersonalRecord && (
                            <span className="history-pr-badge">
                              🏆 Personal Record
                            </span>
                          )}
                        </div>

                        <h2>
                          {workout.workoutName ||
                            "Untitled Workout"}
                        </h2>

                        <p>
                          {workout.exerciseName ||
                            "Exercise not listed"}
                        </p>
                      </div>

                      <span className="history-workout-date">
                        {workout.date ||
                          "No date"}
                      </span>
                    </div>

                    <div className="history-workout-stats upgraded-history-stats">
                      <div>
                        <span>
                          Duration
                        </span>

                        <strong>
                          {workout.duration ||
                            0}{" "}
                          min
                        </strong>
                      </div>

                      <div>
                        <span>
                          Sets × Reps
                        </span>

                        <strong>
                          {workout.sets ||
                            0}{" "}
                          ×{" "}
                          {workout.reps ||
                            0}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Weight
                        </span>

                        <strong>
                          {workout.weight ||
                            0}{" "}
                          lbs
                        </strong>
                      </div>

                      <div>
                        <span>
                          Volume
                        </span>

                        <strong>
                          {workoutVolume.toLocaleString()}{" "}
                          lbs
                        </strong>
                      </div>

                      <div className="history-calorie-stat">
                        <span>
                          Calories
                        </span>

                        <strong>
                          🔥{" "}
                          {workoutCalories.toLocaleString()}{" "}
                          kcal
                        </strong>
                      </div>
                    </div>
                    {workout.notes && (
                      <div className="history-workout-note">
                        <span>Notes</span>

                        <p>
                          {workout.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    className="history-edit-button"
                    type="button"
                    onClick={() =>
                      navigate(
                        `/edit-workout/${workout.id}`
                      )
                    }
                  >
                    Edit Workout
                  </button>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}

export default History;

