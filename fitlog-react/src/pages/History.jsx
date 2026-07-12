import { Link, useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();

  const workouts =
    JSON.parse(localStorage.getItem("fitlogWorkouts")) || [];

  return (
    <main className="page-shell">
      <div className="history-header">
        <div>
          <h1>Workout History</h1>
          <p>Review your past sessions and manage your workouts.</p>
        </div>

        <Link className="primary-link" to="/add-workout">
          + Add Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <h2>No workouts recorded yet</h2>
          <p>Add your first workout to begin tracking progress.</p>

          <Link className="primary-link" to="/add-workout">
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
    </main>
  );
}

export default History;
