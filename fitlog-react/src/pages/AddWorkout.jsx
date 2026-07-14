import { useNavigate } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";

function AddWorkout() {
  const navigate = useNavigate();

  function getUserWorkoutKey() {
    const currentUserId = localStorage.getItem("fitlogCurrentUserId");

    if (!currentUserId) {
      return null;
    }

    return `fitlogWorkouts_${currentUserId}`;
  }

  function saveWorkout(newWorkout) {
    const workoutKey = getUserWorkoutKey();

    if (!workoutKey) {
      alert("User session not found. Please sign in again.");
      navigate("/login");
      return;
    }

    const savedWorkouts =
      JSON.parse(localStorage.getItem(workoutKey)) || [];

    const workoutToSave = {
      ...newWorkout,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      workoutKey,
      JSON.stringify([...savedWorkouts, workoutToSave])
    );

    alert("Workout saved successfully!");
    navigate("/history");
  }

  return (
    <section className="content-page">
      <header className="page-header">
        <div>
          <h1>Add Workout</h1>
          <p>Log a new workout and keep your progress going.</p>
        </div>
      </header>

      <WorkoutForm
        onSubmit={saveWorkout}
        submitText="Save Workout"
        onCancel={() => navigate("/dashboard")}
      />
    </section>
  );
}

export default AddWorkout;
