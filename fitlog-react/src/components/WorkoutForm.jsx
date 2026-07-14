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

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.workoutName.trim() ||
      !formData.date ||
      !formData.exerciseName.trim()
    ) {
      alert(
        "Please enter the workout name, date, and exercise name."
      );
      return;
    }

    onSubmit({
      ...formData,
      duration: Number(formData.duration) || 0,
      sets: Number(formData.sets) || 0,
      reps: Number(formData.reps) || 0,
      weight: Number(formData.weight) || 0,
    });
  }

  return (
    <div className="workout-layout">
      <form
        className="workout-form-card"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="workoutName">Workout Name</label>

            <input
              id="workoutName"
              name="workoutName"
              value={formData.workoutName}
              onChange={handleChange}
              placeholder="e.g., Chest Day"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="exerciseName">
              Exercise Name
            </label>

            <input
              id="exerciseName"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleChange}
              placeholder="e.g., Bench Press"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              Duration (minutes)
            </label>

            <input
              id="duration"
              name="duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 60"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sets">Sets</label>

            <input
              id="sets"
              name="sets"
              type="number"
              min="0"
              value={formData.sets}
              onChange={handleChange}
              placeholder="e.g., 3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reps">Reps</label>

            <input
              id="reps"
              name="reps"
              type="number"
              min="0"
              value={formData.reps}
              onChange={handleChange}
              placeholder="e.g., 10"
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="weight">Weight (lbs)</label>

            <input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 135"
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              name="notes"
              rows="4"
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
        <div className="summary-header">
          <div className="summary-icon">✓</div>

          <div>
            <h3>Workout Summary</h3>
            <p>Review your workout details.</p>
          </div>
        </div>

        <div className="summary-row">
          <span>Workout</span>
          <strong>{formData.workoutName || "—"}</strong>
        </div>

        <div className="summary-row">
          <span>Date</span>
          <strong>{formData.date || "—"}</strong>
        </div>

        <div className="summary-row">
          <span>Exercise</span>
          <strong>{formData.exerciseName || "—"}</strong>
        </div>

        <div className="summary-details">
          <p>Duration: {formData.duration || 0} minutes</p>
          <p>Sets: {formData.sets || 0}</p>
          <p>Reps: {formData.reps || 0}</p>
          <p>Weight: {formData.weight || 0} lbs</p>
        </div>

        <div className="ready-message">
          ● Status: Ready to Save
        </div>
      </aside>
    </div>
  );
}

export default WorkoutForm;
