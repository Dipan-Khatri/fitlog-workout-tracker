import { useEffect, useState } from "react";

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

const workoutTemplates = [
  {
    id: "chest",
    name: "Chest Day",
    icon: "💪",
    data: {
      workoutName: "Chest Day",
      exerciseName: "Bench Press",
      duration: 60,
      sets: 4,
      reps: 10,
      weight: 135,
      notes:
        "Warm up first and focus on controlled repetitions.",
    },
  },
  {
    id: "back",
    name: "Back Day",
    icon: "🏋️",
    data: {
      workoutName: "Back Day",
      exerciseName: "Lat Pulldown",
      duration: 55,
      sets: 4,
      reps: 12,
      weight: 100,
      notes:
        "Keep the chest lifted and squeeze your shoulder blades.",
    },
  },
  {
    id: "legs",
    name: "Leg Day",
    icon: "🦵",
    data: {
      workoutName: "Leg Day",
      exerciseName: "Squat",
      duration: 70,
      sets: 4,
      reps: 8,
      weight: 155,
      notes:
        "Use proper depth and keep your knees aligned.",
    },
  },
  {
    id: "push",
    name: "Push Day",
    icon: "⬆️",
    data: {
      workoutName: "Push Day",
      exerciseName: "Shoulder Press",
      duration: 60,
      sets: 4,
      reps: 10,
      weight: 65,
      notes:
        "Train chest, shoulders and triceps.",
    },
  },
  {
    id: "pull",
    name: "Pull Day",
    icon: "⬇️",
    data: {
      workoutName: "Pull Day",
      exerciseName: "Barbell Row",
      duration: 60,
      sets: 4,
      reps: 10,
      weight: 95,
      notes:
        "Train back and biceps with strict form.",
    },
  },
  {
    id: "fullbody",
    name: "Full Body",
    icon: "🔥",
    data: {
      workoutName: "Full Body Workout",
      exerciseName: "Goblet Squat",
      duration: 75,
      sets: 3,
      reps: 12,
      weight: 45,
      notes:
        "Complete a balanced full body workout.",
    },
  },
];

function WorkoutForm({
  initialWorkout = emptyWorkout,
  onSubmit,
  submitText,
  showDelete = false,
  onDelete,
  onCancel,
  showTemplates = false,
}) {
  const [formData, setFormData] = useState({
    ...emptyWorkout,
    ...initialWorkout,
  });

  const [errors, setErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] =
    useState("");

  useEffect(() => {
    setFormData({
      ...emptyWorkout,
      ...initialWorkout,
    });
  }, [initialWorkout]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function applyTemplate(template) {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    setSelectedTemplate(template.id);

    setFormData((currentData) => ({
      ...currentData,
      ...template.data,
      date: currentData.date || today,
    }));

    setErrors({});
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.workoutName.trim()) {
      newErrors.workoutName =
        "Workout name is required.";
    }

    if (!formData.date) {
      newErrors.date = "Date is required.";
    }

    if (!formData.exerciseName.trim()) {
      newErrors.exerciseName =
        "Exercise name is required.";
    }

    if (Number(formData.duration) <= 0) {
      newErrors.duration =
        "Duration must be greater than 0.";
    }

    if (Number(formData.sets) <= 0) {
      newErrors.sets =
        "Sets must be greater than 0.";
    }

    if (Number(formData.reps) <= 0) {
      newErrors.reps =
        "Reps must be greater than 0.";
    }

    if (Number(formData.weight) < 0) {
      newErrors.weight =
        "Weight cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      duration: Number(formData.duration),
      sets: Number(formData.sets),
      reps: Number(formData.reps),
      weight: Number(formData.weight) || 0,
    });
  }

  return (
    <>
      {showTemplates && (
        <section className="workout-template-section">
          <div className="section-heading">
            <h2>Quick Workout Templates</h2>

            <p>
              Select a template to automatically
              fill the form.
            </p>
          </div>

          <div className="workout-template-grid">
            {workoutTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={
                  selectedTemplate === template.id
                    ? "workout-template-card selected"
                    : "workout-template-card"
                }
                onClick={() =>
                  applyTemplate(template)
                }
              >
                <span>{template.icon}</span>

                <strong>{template.name}</strong>

                <small>
                  {template.data.exerciseName}
                </small>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="workout-layout">

        <form
          className="workout-form-card"
          onSubmit={handleSubmit}
          noValidate
        >

          {Object.keys(errors).length > 0 && (
            <div className="form-error-summary">
              Please correct the highlighted
              fields before saving.
            </div>
          )}
                    <div className="form-grid">
            <div className="form-group">
              <label htmlFor="workoutName">
                Workout Name
              </label>

              <input
                id="workoutName"
                name="workoutName"
                value={formData.workoutName}
                onChange={handleChange}
                placeholder="e.g., Chest Day"
                className={
                  errors.workoutName
                    ? "input-error"
                    : ""
                }
              />

              {errors.workoutName && (
                <small className="field-error">
                  {errors.workoutName}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={
                  errors.date
                    ? "input-error"
                    : ""
                }
              />

              {errors.date && (
                <small className="field-error">
                  {errors.date}
                </small>
              )}
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
                className={
                  errors.exerciseName
                    ? "input-error"
                    : ""
                }
              />

              {errors.exerciseName && (
                <small className="field-error">
                  {errors.exerciseName}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="duration">
                Duration (minutes)
              </label>

              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 60"
                className={
                  errors.duration
                    ? "input-error"
                    : ""
                }
              />

              {errors.duration && (
                <small className="field-error">
                  {errors.duration}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sets">
                Sets
              </label>

              <input
                id="sets"
                name="sets"
                type="number"
                min="1"
                value={formData.sets}
                onChange={handleChange}
                placeholder="e.g., 3"
                className={
                  errors.sets
                    ? "input-error"
                    : ""
                }
              />

              {errors.sets && (
                <small className="field-error">
                  {errors.sets}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reps">
                Reps
              </label>

              <input
                id="reps"
                name="reps"
                type="number"
                min="1"
                value={formData.reps}
                onChange={handleChange}
                placeholder="e.g., 10"
                className={
                  errors.reps
                    ? "input-error"
                    : ""
                }
              />

              {errors.reps && (
                <small className="field-error">
                  {errors.reps}
                </small>
              )}
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="weight">
                Weight (lbs)
              </label>

              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 135"
                className={
                  errors.weight
                    ? "input-error"
                    : ""
                }
              />

              {errors.weight && (
                <small className="field-error">
                  {errors.weight}
                </small>
              )}
            </div>
                        <div className="form-group form-group-full">
              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="4"
                maxLength="500"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add notes about your workout..."
              />

              <small className="field-help-text">
                {formData.notes.length} / 500 characters
              </small>
            </div>
          </div>

          <button
            className="primary-button"
            type="submit"
          >
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

            <div className="summary-icon">
              ✓
            </div>

            <div>
              <h3>Workout Summary</h3>

              <p>
                Review your workout details.
              </p>
            </div>

          </div>

          <div className="summary-row">
            <span>Workout</span>

            <strong>
              {formData.workoutName || "—"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Date</span>

            <strong>
              {formData.date || "—"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Exercise</span>

            <strong>
              {formData.exerciseName || "—"}
            </strong>
          </div>

          <div className="summary-details">

            <p>
              Duration:
              {" "}
              {formData.duration || 0}
              {" "}
              minutes
            </p>

            <p>
              Sets:
              {" "}
              {formData.sets || 0}
            </p>

            <p>
              Reps:
              {" "}
              {formData.reps || 0}
            </p>

            <p>
              Weight:
              {" "}
              {formData.weight || 0}
              {" "}
              lbs
            </p>

            <p>
              Volume:
              {" "}
              {(
                Number(formData.sets || 0) *
                Number(formData.reps || 0) *
                Number(formData.weight || 0)
              ).toLocaleString()}
              {" "}
              lbs
            </p>

          </div>
                    <div className="ready-message">
            ● Status: Ready to Save
          </div>

        </aside>

      </div>

    </>
  );
}

export default WorkoutForm;
