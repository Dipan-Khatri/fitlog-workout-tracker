import { useState } from "react";

const emptyWorkout = {
  workoutName: "",
  date: "",
  exerciseName: "",
  duration: "",
  sets: "",
  reps: "",
  weight: "",
  notes: "",
};

function WorkoutForm({
  initialWorkout = emptyWorkout,
  onSubmit,
  submitText,
  showDelete = false,
  onDelete,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    ...emptyWorkout,
    ...initialWorkout,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.workoutName.trim() ||
      !formData.date ||
      !formData.exerciseName.trim()
    ) {
      alert("Please enter the workout name, date, and exercise name.");
      return;
    }

    onSubmit({
      ...formData,
      duration: Number(formData.duration) || 0,
      sets: Number(formData.sets) || 0,
      reps: Number(formData.reps) || 0,
      weight: Number(formData.weight) || 0,
    });
  };

  return (
    <div className="workout-layout">
      <form className="workout-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Workout Name</label>
            <input
              name="workoutName"
              value={formData.workoutName}
              onChange={handleChange}
              placeholder="e.g., Chest Day"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Exercise Name</label>
            <input
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleChange}
              placeholder="e.g., Bench Press"
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              name="duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 60"
            />
          </div>

          <div className="form-group">
            <label>Sets</label>
            <input
              name="sets"
              type="number"
              min="0"
              value={formData.sets}
              onChange={handleChange}
              placeholder="e.g., 3"
            />
          </div>

          <div className="form-group">
            <label>Reps</label>
            <input
              name="reps"
              type="number"
              min="0"
              value={formData.reps}
              onChange={handleChange}
              placeholder="e.g., 10"
            />
          </div>

          <div className="form-group form-group-full">
            <label>Weight (lbs)</label>
            <input
              name="weight"
              type="number"
              min="0"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 135"
            />
          </div>

          <div className="form-group form-group-full">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes about your workout..."
            />
          </div>
        </div>

        <button className="primary-button" type="submit">
          {submitText}
        </button>

        {showDelete && (
          <button
            className="delete-button"
            type="button"
            onClick={onDelete}
          >
            Delete Workout
          </button>
        )}

        <button
          className="cancel-button"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>

      <aside className="summary-card">
        <h3>Workout Summary</h3>

        <p>
          <strong>Workout:</strong>{" "}
          {formData.workoutName || "—"}
        </p>

        <p>
          <strong>Date:</strong> {formData.date || "—"}
        </p>

        <p>
          <strong>Exercise:</strong>{" "}
          {formData.exerciseName || "—"}
        </p>

        <p>{formData.duration || 0} minutes</p>
        <p>{formData.sets || 0} sets</p>
        <p>{formData.reps || 0} reps</p>
        <p>{formData.weight || 0} lbs</p>
      </aside>
    </div>
  );
}

export default WorkoutForm;
