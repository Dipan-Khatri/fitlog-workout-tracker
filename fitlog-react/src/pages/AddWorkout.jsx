import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";

function AddWorkout() {
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] =
    useState("");

  function getUserWorkoutKey() {
    const currentUserId =
      localStorage.getItem("fitlogCurrentUserId");

    if (!currentUserId) {
      return null;
    }

    return `fitlogWorkouts_${currentUserId}`;
  }

  function saveWorkout(newWorkout) {
    const workoutKey = getUserWorkoutKey();

    if (!workoutKey) {
      navigate("/login");
      return;
    }

    let savedWorkouts = [];

    try {
      savedWorkouts =
        JSON.parse(
          localStorage.getItem(workoutKey)
        ) || [];
    } catch (error) {
      console.error(
        "Unable to load saved workouts:",
        error
      );
    }

    const workoutToSave = {
      ...newWorkout,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      workoutKey,
      JSON.stringify([
        ...savedWorkouts,
        workoutToSave,
      ])
    );

    setSuccessMessage(
      "Workout saved successfully! Opening your history..."
    );

    window.setTimeout(() => {
      navigate("/history");
    }, 900);
  }

  return (
    <section className="content-page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">
            Workout Builder
          </p>

          <h1>Add Workout</h1>

          <p>
            Use a quick template or create a
            custom workout.
          </p>
        </div>
      </header>

      {successMessage && (
        <div
          className="workout-success-toast"
          role="status"
        >
          <span>✓</span>
          {successMessage}
        </div>
      )}

      <WorkoutForm
        onSubmit={saveWorkout}
        submitText="Save Workout"
        onCancel={() =>
          navigate("/dashboard")
        }
        showTemplates
      />
    </section>
  );
}

export default AddWorkout;
