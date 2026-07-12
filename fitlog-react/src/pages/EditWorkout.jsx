import { useNavigate, useParams } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";

function EditWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();

  const savedWorkouts =
    JSON.parse(localStorage.getItem("fitlogWorkouts")) || [];

  const selectedWorkout = savedWorkouts.find(
    (workout) => workout.id === id
  );

  const updateWorkout = (updatedWorkout) => {
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
      "fitlogWorkouts",
      JSON.stringify(updatedWorkouts)
    );

    alert("Workout updated successfully!");
    navigate("/history");
  };

  const deleteWorkout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) {
      return;
    }

    const remainingWorkouts = savedWorkouts.filter(
      (workout) => workout.id !== id
    );

    localStorage.setItem(
      "fitlogWorkouts",
      JSON.stringify(remainingWorkouts)
    );

    alert("Workout deleted successfully.");
    navigate("/history");
  };

  if (!selectedWorkout) {
    return (
      <main className="page-shell">
        <div className="empty-state">
          <h2>Workout not found</h2>

          <button
            className="primary-button"
            onClick={() => navigate("/history")}
          >
            Return to History
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate("/history")}
        >
          ←
        </button>

        <div>
          <h1>Edit / Delete Workout</h1>
          <p>Update your workout details or remove it from your plan.</p>
        </div>
      </div>

      <WorkoutForm
        initialWorkout={selectedWorkout}
        onSubmit={updateWorkout}
        submitText="Update Workout"
        showDelete
        onDelete={deleteWorkout}
        onCancel={() => navigate("/history")}
      />
    </main>
  );
}

export default EditWorkout; 