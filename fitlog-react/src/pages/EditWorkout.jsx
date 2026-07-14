import {
  useNavigate,
  useParams,
} from "react-router-dom";

import WorkoutForm from "../components/WorkoutForm";

function EditWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentUserId = localStorage.getItem("fitlogCurrentUserId");

  const workoutKey = currentUserId
    ? `fitlogWorkouts_${currentUserId}`
    : null;

  const savedWorkouts = workoutKey
    ? JSON.parse(localStorage.getItem(workoutKey)) || []
    : [];

  const selectedWorkout = savedWorkouts.find(
    (workout) => workout.id === id
  );

  function updateWorkout(updatedWorkout) {
    if (!workoutKey) {
      navigate("/login");
      return;
    }

    const updatedWorkouts = savedWorkouts.map((workout) =>
      workout.id === id
        ? {
            ...workout,
            ...updatedWorkout,
            updatedAt: new Date().toISOString(),
          }
        : workout
    );

    localStorage.setItem(
      workoutKey,
      JSON.stringify(updatedWorkouts)
    );

    alert("Workout updated successfully!");
    navigate("/history");
  }

  function deleteWorkout() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed || !workoutKey) {
      return;
    }

    const remainingWorkouts = savedWorkouts.filter(
      (workout) => workout.id !== id
    );

    localStorage.setItem(
      workoutKey,
      JSON.stringify(remainingWorkouts)
    );

    alert("Workout deleted successfully.");
    navigate("/history");
  }

  if (!selectedWorkout) {
    return (
      <section className="content-page">
        <div className="empty-state">
          <h2>Workout not found</h2>

          <button
            className="primary-button"
            type="button"
            onClick={() => navigate("/history")}
          >
            Return to History
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="content-page">
      <header className="page-header">
        <div>
          <h1>Edit / Delete Workout</h1>

          <p>
            Update your workout details or remove the workout.
          </p>
        </div>
      </header>

      <WorkoutForm
        initialWorkout={selectedWorkout}
        onSubmit={updateWorkout}
        submitText="Update Workout"
        showDelete
        onDelete={deleteWorkout}
        onCancel={() => navigate("/history")}
      />
    </section>
  );
}

export default EditWorkout;
