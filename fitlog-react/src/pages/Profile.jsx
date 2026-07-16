import { useMemo, useState } from "react";

function calculateBmi(
  heightInches,
  weightPounds
) {
  const height =
    Number(heightInches);

  const weight =
    Number(weightPounds);

  if (
    height <= 0 ||
    weight <= 0
  ) {
    return null;
  }

  return (
    (weight /
      (height * height)) *
    703
  );
}

function getBmiCategory(bmi) {
  if (!bmi) {
    return {
      label: "Not available",
      className: "unknown",
      message:
        "Enter your height and weight to calculate BMI.",
    };
  }

  if (bmi < 18.5) {
    return {
      label: "Underweight",
      className: "underweight",
      message:
        "Your BMI is below the standard healthy range.",
    };
  }

  if (bmi < 25) {
    return {
      label: "Healthy Weight",
      className: "healthy",
      message:
        "Your BMI is within the standard healthy range.",
    };
  }

  if (bmi < 30) {
    return {
      label: "Overweight",
      className: "overweight",
      message:
        "Your BMI is above the standard healthy range.",
    };
  }

  return {
    label: "Obesity Range",
    className: "obesity",
    message:
      "Your BMI is within the obesity range.",
  };
}

function Profile() {
  const currentUserId =
    localStorage.getItem(
      "fitlogCurrentUserId"
    );

  let savedUsers = [];
  let workouts = [];

  try {
    savedUsers =
      JSON.parse(
        localStorage.getItem(
          "fitlogUsers"
        )
      ) || [];
  } catch (error) {
    console.error(
      "Unable to load users:",
      error
    );

    savedUsers = [];
  }

  const currentUser =
    savedUsers.find(
      (user) =>
        user.id ===
        currentUserId
    );

  const workoutKey =
    currentUserId
      ? `fitlogWorkouts_${currentUserId}`
      : null;

  try {
    workouts =
      workoutKey
        ? JSON.parse(
            localStorage.getItem(
              workoutKey
            )
          ) || []
        : [];
  } catch (error) {
    console.error(
      "Unable to load workouts:",
      error
    );

    workouts = [];
  }

  const weeklyGoalKey =
    currentUserId
      ? `fitlogWeeklyGoal_${currentUserId}`
      : null;

  const savedWeeklyGoal =
    Number(
      weeklyGoalKey
        ? localStorage.getItem(
            weeklyGoalKey
          )
        : 5
    );

  const [formData, setFormData] =
    useState({
      name:
        currentUser?.name || "",

      email:
        currentUser?.email || "",

      age:
        currentUser?.age || "",

      height:
        currentUser?.height || "",

      weight:
        currentUser?.weight || "",

      targetWeight:
        currentUser?.targetWeight ||
        "",

      fitnessGoal:
        currentUser?.fitnessGoal ||
        "Build Muscle",

      weeklyGoal:
        savedWeeklyGoal >= 2 &&
        savedWeeklyGoal <= 7
          ? savedWeeklyGoal
          : 5,

      fitnessLevel:
        currentUser?.fitnessLevel ||
        "Beginner",

      bio:
        currentUser?.bio || "",
    });

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentData) => ({
        ...currentData,
        [name]: value,
      })
    );

    setMessage("");
    setMessageType("");
  }

  const bmi = useMemo(() => {
    return calculateBmi(
      formData.height,
      formData.weight
    );
  }, [
    formData.height,
    formData.weight,
  ]);

  const bmiCategory =
    getBmiCategory(bmi);

  const totalDuration =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.duration || 0
        ),
      0
    );

  const totalVolume =
    workouts.reduce(
      (total, workout) =>
        total +
        Number(
          workout.sets || 0
        ) *
          Number(
            workout.reps || 0
          ) *
          Number(
            workout.weight || 0
          ),
      0
    );

  const uniqueWorkoutDates = [
    ...new Set(
      workouts
        .map(
          (workout) =>
            workout.date
        )
        .filter(Boolean)
    ),
  ];

  const profileFields = [
    formData.name,
    formData.email,
    formData.age,
    formData.height,
    formData.weight,
    formData.targetWeight,
    formData.fitnessGoal,
    formData.fitnessLevel,
    formData.bio,
  ];

  const completedFields =
    profileFields.filter(
      (field) =>
        String(field).trim() !== ""
    ).length;

  const profileCompletion =
    Math.round(
      (
        completedFields /
        profileFields.length
      ) * 100
    );

  const weightDifference =
    formData.weight &&
    formData.targetWeight
      ? Math.abs(
          Number(
            formData.weight
          ) -
            Number(
              formData.targetWeight
            )
        )
      : 0;

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !currentUserId ||
      !currentUser
    ) {
      setMessage(
        "User information could not be found."
      );

      setMessageType("error");

      return;
    }

    if (
      !formData.name.trim()
    ) {
      setMessage(
        "Please enter your name."
      );

      setMessageType("error");

      return;
    }

    if (
      formData.age &&
      (
        Number(
          formData.age
        ) < 1 ||
        Number(
          formData.age
        ) > 120
      )
    ) {
      setMessage(
        "Please enter a valid age between 1 and 120."
      );

      setMessageType("error");

      return;
    }

    if (
      formData.height &&
      Number(
        formData.height
      ) <= 0
    ) {
      setMessage(
        "Height must be greater than zero."
      );

      setMessageType("error");

      return;
    }

    if (
      formData.weight &&
      Number(
        formData.weight
      ) <= 0
    ) {
      setMessage(
        "Weight must be greater than zero."
      );

      setMessageType("error");

      return;
    }

    if (
      formData.targetWeight &&
      Number(
        formData.targetWeight
      ) <= 0
    ) {
      setMessage(
        "Target weight must be greater than zero."
      );

      setMessageType("error");

      return;
    }

    const updatedUsers =
      savedUsers.map(
        (user) =>
          user.id ===
          currentUserId
            ? {
                ...user,

                name:
                  formData.name.trim(),

                age:
                  Number(
                    formData.age
                  ) || "",

                height:
                  Number(
                    formData.height
                  ) || "",

                weight:
                  Number(
                    formData.weight
                  ) || "",

                targetWeight:
                  Number(
                    formData.targetWeight
                  ) || "",

                fitnessGoal:
                  formData.fitnessGoal,

                fitnessLevel:
                  formData.fitnessLevel,

                bio:
                  formData.bio.trim(),

                updatedAt:
                  new Date().toISOString(),
              }
            : user
      );

    localStorage.setItem(
      "fitlogUsers",
      JSON.stringify(
        updatedUsers
      )
    );

    localStorage.setItem(
      "fitlogUserName",
      formData.name.trim()
    );

    if (weeklyGoalKey) {
      localStorage.setItem(
        weeklyGoalKey,
        String(
          formData.weeklyGoal
        )
      );
    }

    setMessage(
      "Profile updated successfully."
    );

    setMessageType("success");
  }

  const firstLetter =
    formData.name
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  return (
    <section className="content-page profile-page">
      <header className="page-title">
        <p className="page-eyebrow">
          Member Settings
        </p>

        <h1>User Profile</h1>

        <p>
          Manage your personal information,
          fitness goals, and health summary.
        </p>
      </header>

      <section className="profile-overview-grid">
        <article className="profile-completion-card">
          <div>
            <span>Profile Completion</span>

            <strong>
              {profileCompletion}%
            </strong>
          </div>

          <div className="profile-completion-bar">
            <div
              className="profile-completion-fill"
              style={{
                width: `${profileCompletion}%`,
              }}
            />
          </div>

          <p>
            Complete your profile for more
            accurate calorie and fitness
            calculations.
          </p>
        </article>

        <article className="profile-bmi-card">
          <div className="profile-bmi-icon">
            ⚖️
          </div>

          <div>
            <span>Current BMI</span>

            <strong>
              {bmi
                ? bmi.toFixed(1)
                : "—"}
            </strong>

            <small
              className={`profile-bmi-status ${bmiCategory.className}`}
            >
              {bmiCategory.label}
            </small>
          </div>
        </article>

        <article className="profile-stat-card">
          <span>🏋️</span>

          <div>
            <small>
              Total Workouts
            </small>

            <strong>
              {workouts.length}
            </strong>
          </div>
        </article>

        <article className="profile-stat-card">
          <span>⏱️</span>

          <div>
            <small>
              Total Minutes
            </small>

            <strong>
              {totalDuration}
            </strong>
          </div>
        </article>
      </section>

      <div className="profile-layout upgraded-profile-layout">
        <aside className="profile-summary-card upgraded-profile-summary">
          <div className="profile-large-avatar">
            {firstLetter}
          </div>

          <h2>
            {formData.name ||
              "FitLog User"}
          </h2>

          <p>{formData.email}</p>

          <div className="profile-badge-row">
            <div className="profile-goal-badge">
              {formData.fitnessGoal}
            </div>

            <div className="profile-level-badge">
              {formData.fitnessLevel}
            </div>
          </div>

          <div className="profile-details-list">
            <div>
              <span>Age</span>

              <strong>
                {formData.age
                  ? `${formData.age} years`
                  : "Not set"}
              </strong>
            </div>

            <div>
              <span>Height</span>

              <strong>
                {formData.height
                  ? `${formData.height} inches`
                  : "Not set"}
              </strong>
            </div>

            <div>
              <span>
                Current Weight
              </span>

              <strong>
                {formData.weight
                  ? `${formData.weight} lbs`
                  : "Not set"}
              </strong>
            </div>

            <div>
              <span>
                Target Weight
              </span>

              <strong>
                {formData.targetWeight
                  ? `${formData.targetWeight} lbs`
                  : "Not set"}
              </strong>
            </div>

            <div>
              <span>
                Weekly Goal
              </span>

              <strong>
                {formData.weeklyGoal} days
              </strong>
            </div>

            <div>
              <span>
                Workout Days
              </span>

              <strong>
                {uniqueWorkoutDates.length}
              </strong>
            </div>

            <div>
              <span>
                Total Volume
              </span>

              <strong>
                {totalVolume.toLocaleString()}{" "}
                lbs
              </strong>
            </div>
          </div>

          {formData.weight &&
            formData.targetWeight && (
              <div className="profile-weight-goal-card">
                <span>
                  Weight Goal Difference
                </span>

                <strong>
                  {weightDifference.toFixed(1)}{" "}
                  lbs
                </strong>

                <p>
                  {Number(
                    formData.weight
                  ) >
                  Number(
                    formData.targetWeight
                  )
                    ? "remaining to lose"
                    : Number(
                        formData.weight
                      ) <
                      Number(
                        formData.targetWeight
                      )
                    ? "remaining to gain"
                    : "goal reached"}
                </p>
              </div>
            )}

          <div
            className={`profile-bmi-summary ${bmiCategory.className}`}
          >
            <div>
              <span>
                BMI Summary
              </span>

              <strong>
                {bmi
                  ? bmi.toFixed(1)
                  : "Not available"}
              </strong>
            </div>

            <p>
              {bmiCategory.message}
            </p>
          </div>
        </aside>

        <form
          className="profile-form-card upgraded-profile-form"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-header">
            <div>
              <h2>Edit Profile</h2>

              <p>
                Update your information,
                body measurements, and
                training preferences.
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`profile-message ${messageType}`}
            >
              {message}
            </div>
          )}

          <div className="profile-form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
              />

              <small className="field-help-text">
                Email cannot be changed.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="age">
                Age
              </label>

              <input
                id="age"
                name="age"
                type="number"
                min="13"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g., 25"
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">
                Height (inches)
              </label>

              <input
                id="height"
                name="height"
                type="number"
                min="1"
                step="0.1"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 68"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">
                Current Weight (lbs)
              </label>

              <input
                id="weight"
                name="weight"
                type="number"
                min="1"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 165"
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetWeight">
                Target Weight (lbs)
              </label>

              <input
                id="targetWeight"
                name="targetWeight"
                type="number"
                min="1"
                step="0.1"
                value={
                  formData.targetWeight
                }
                onChange={handleChange}
                placeholder="e.g., 155"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fitnessGoal">
                Fitness Goal
              </label>

              <select
                id="fitnessGoal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
              >
                <option value="Build Muscle">
                  Build Muscle
                </option>

                <option value="Lose Weight">
                  Lose Weight
                </option>

                <option value="Maintain Weight">
                  Maintain Weight
                </option>

                <option value="Improve Endurance">
                  Improve Endurance
                </option>

                <option value="Increase Strength">
                  Increase Strength
                </option>

                <option value="Stay Active">
                  Stay Active
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fitnessLevel">
                Fitness Level
              </label>

              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weeklyGoal">
                Weekly Workout Goal
              </label>

              <select
                id="weeklyGoal"
                name="weeklyGoal"
                value={formData.weeklyGoal}
                onChange={handleChange}
              >
                {[2, 3, 4, 5, 6, 7].map(
                  (goal) => (
                    <option
                      key={goal}
                      value={goal}
                    >
                      {goal} active days
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="bio">
                Fitness Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                rows="5"
                maxLength="500"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your fitness journey or goals..."
              />

              <small className="field-help-text">
                {formData.bio.length} / 500 characters
              </small>
            </div>
          </div>

          <section className="profile-live-bmi-panel">
            <div>
              <span>
                Live BMI Preview
              </span>

              <strong>
                {bmi
                  ? bmi.toFixed(1)
                  : "—"}
              </strong>
            </div>

            <div>
              <span>
                Category
              </span>

              <strong
                className={`profile-bmi-status ${bmiCategory.className}`}
              >
                {bmiCategory.label}
              </strong>
            </div>

            <p>
              BMI is a general screening estimate and
              does not measure body composition directly.
            </p>
          </section>

          <button
            className="profile-save-button"
            type="submit"
          >
            Save Profile
          </button>
        </form>
      </div>
    </section>
  );
}

export default Profile;

