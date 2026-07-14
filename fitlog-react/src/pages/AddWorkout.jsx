import { useNavigate } from "react-router";
import WorkoutForm from "../components/WorkoutForm";

function AddWorkout() {
  const navigate = useNavigate();

  const saveWorkout = (newWorkout) => {
    const savedWorkouts =
      JSON.parse(localStorage.getItem("fitlogWorkouts")) || [];

    const workoutToSave = {
      ...newWorkout,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedWorkouts = [...savedWorkouts, workoutToSave];

    localStorage.setItem(
      "fitlogWorkouts",
      JSON.stringify(updatedWorkouts)
    );

    alert("Workout saved successfully!");
    navigate("/history");
  };

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
          <h1>Add Workout</h1>
          <p>Log a new workout and keep your progress going.</p>
        </div>
      </div>

      <WorkoutForm
        onSubmit={saveWorkout}
        submitText="Save Workout"
        onCancel={() => navigate("/history")}
      />
    </main>
  );
}

export default AddWorkout; 