import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem(
    "fitlogCurrentUserId"
  );

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

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  function getWorkoutDate(workout) {
    const value = workout.date || workout.createdAt;

    if (!value) {
      return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  function isThisWeek(date) {
    if (!date) {
      return false;
    }

    const now = new Date();
    const currentDay = now.getDay();

    const mondayDifference =
      currentDay === 0 ? -6 : 1 - currentDay;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(
      now.getDate() + mondayDifference
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return date >= startOfWeek && date < endOfWeek;
  }

  function isThisMonth(date) {
    if (!date) {
      return false;
    }

    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  const filteredWorkouts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const matchingWorkouts = workouts.filter(
      (workout) => {
        const workoutName = String(
          workout.workoutName || ""
        ).toLowerCase();

        const exerciseName = String(
          workout.exerciseName || ""
        ).toLowerCase();

        const notes = String(
          workout.notes || ""
        ).toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          workoutName.includes(normalizedSearch) ||
          exerciseName.includes(normalizedSearch) ||
          notes.includes(normalizedSearch);

        const workoutDate =
          getWorkoutDate(workout);

        let matchesDate = true;

        if (dateFilter === "week") {
          matchesDate = isThisWeek(workoutDate);
        }

        if (dateFilter === "month") {
          matchesDate = isThisMonth(workoutDate);
        }

        return matchesSearch && matchesDate;
      }
    );

    return [...matchingWorkouts].sort(
      (firstWorkout, secondWorkout) => {
        const firstDate =
          getWorkoutDate(firstWorkout)?.getTime() || 0;

        const secondDate =
          getWorkoutDate(secondWorkout)?.getTime() || 0;

        if (sortOrder === "oldest") {
          return firstDate - secondDate;
        }

        if (sortOrder === "name") {
          return String(
            firstWorkout.workoutName || ""
          ).localeCompare(
            String(
              secondWorkout.workoutName || ""
            )
          );
        }

        return secondDate - firstDate;
      }
    );
  }, [workouts, searchTerm, dateFilter, sortOrder]);

  function clearFilters() {
    setSearchTerm("");
    setDateFilter("all");
    setSortOrder("newest");
  }

  const filtersAreActive =
    searchTerm.trim() ||
    dateFilter !== "all" ||
    sortOrder !== "newest";

  return (
    <section className="content-page history-page">
      <header className="history-header">
        <div>
          <p className="page-eyebrow">
            Workout Management
          </p>

          <h1>Workout History</h1>

          <p>
            Search, filter, review, and manage your
            saved workout sessions.
          </p>
        </div>

        <Link
          to="/add-workout"
          className="primary-link"
        >
          + Add Workout
        </Link>
      </header>

      <section className="history-filter-card">
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
              placeholder="Search by workout, exercise, or notes"
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
          <strong>{filteredWorkouts.length}</strong>{" "}
          of <strong>{workouts.length}</strong>{" "}
          workouts
        </p>

        {filtersAreActive && (
          <span>Filters applied</span>
        )}
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state history-empty-state">
          <div className="history-empty-icon">
            🏋️
          </div>

          <h2>No workouts recorded yet</h2>

          <p>
            Add your first workout to begin tracking
            your fitness journey.
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

          <h2>No matching workouts</h2>

          <p>
            Try changing your search term or removing
            one of the filters.
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
          {filteredWorkouts.map((workout) => {
            const workoutVolume =
              Number(workout.sets || 0) *
              Number(workout.reps || 0) *
              Number(workout.weight || 0);

            return (
              <article
                className="history-workout-card"
                key={workout.id}
              >
                <div className="history-workout-icon">
                  🏋️
                </div>

                <div className="history-workout-main">
                  <div className="history-workout-title-row">
                    <div>
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
                      {workout.date || "No date"}
                    </span>
                  </div>

                  <div className="history-workout-stats">
                    <div>
                      <span>Duration</span>
                      <strong>
                        {workout.duration || 0} min
                      </strong>
                    </div>

                    <div>
                      <span>Sets × Reps</span>
                      <strong>
                        {workout.sets || 0} ×{" "}
                        {workout.reps || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Weight</span>
                      <strong>
                        {workout.weight || 0} lbs
                      </strong>
                    </div>

                    <div>
                      <span>Volume</span>
                      <strong>
                        {workoutVolume.toLocaleString()}{" "}
                        lbs
                      </strong>
                    </div>
                  </div>

                  {workout.notes && (
                    <div className="history-workout-note">
                      <span>Notes</span>
                      <p>{workout.notes}</p>
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
          })}
        </div>
      )}
    </section>
  );
}

export default History;
