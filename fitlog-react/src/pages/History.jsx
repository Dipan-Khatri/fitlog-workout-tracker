import { Link, useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("fitlogCurrentUserId");

  const workoutKey = currentUserId
    ? `fitlogWorkouts_${currentUserId}`
    : null;

  const workouts = workoutKey
    ? JSON.parse(localStorage.getItem(workoutKey)) || []
    : [];

  return (
    <section className="content-page">
      <header className="history-header">
        <div>
          <h1>Workout History</h1>
          <p>Review and manage your saved workout sessions.</p>
        </div>

        <Link to="/add-workout" className="primary-link">
          + Add Workout
        </Link>
      </header>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <h2>No workouts recorded yet</h2>

          <p>
            Add your first workout to begin tracking progress.
          </p>

          <Link to="/add-workout" className="primary-link">
            Add Workout
          </Link>
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Workout</th>
                <th>Date</th>
                <th>Exercise</th>
                <th>Duration</th>
                <th>Sets × Reps</th>
                <th>Weight</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.workoutName}</td>
                  <td>{workout.date}</td>
                  <td>{workout.exerciseName}</td>
                  <td>{workout.duration} min</td>
                  <td>
                    {workout.sets} × {workout.reps}
                  </td>
                  <td>{workout.weight} lbs</td>

                  <td>
                    <button
                      className="edit-small-button"
                      type="button"
                      onClick={() =>
                        navigate(`/edit-workout/${workout.id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default History;
