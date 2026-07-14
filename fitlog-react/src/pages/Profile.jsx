import { useState } from "react";

function Profile() {
  const currentUserId = localStorage.getItem("fitlogCurrentUserId");

  const savedUsers =
    JSON.parse(localStorage.getItem("fitlogUsers")) || [];

  const currentUser = savedUsers.find(
    (user) => user.id === currentUserId
  );

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    age: currentUser?.age || "",
    height: currentUser?.height || "",
    weight: currentUser?.weight || "",
    fitnessGoal: currentUser?.fitnessGoal || "Build Muscle",
    bio: currentUser?.bio || "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!currentUserId || !currentUser) {
      setMessage("User information could not be found.");
      return;
    }

    if (!formData.name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (
      formData.age &&
      (Number(formData.age) < 13 || Number(formData.age) > 120)
    ) {
      setMessage("Please enter a valid age.");
      return;
    }

    if (formData.height && Number(formData.height) <= 0) {
      setMessage("Height must be greater than zero.");
      return;
    }

    if (formData.weight && Number(formData.weight) <= 0) {
      setMessage("Weight must be greater than zero.");
      return;
    }

    const updatedUsers = savedUsers.map((user) =>
      user.id === currentUserId
        ? {
            ...user,
            name: formData.name.trim(),
            age: Number(formData.age) || "",
            height: Number(formData.height) || "",
            weight: Number(formData.weight) || "",
            fitnessGoal: formData.fitnessGoal,
            bio: formData.bio.trim(),
            updatedAt: new Date().toISOString(),
          }
        : user
    );

    localStorage.setItem(
      "fitlogUsers",
      JSON.stringify(updatedUsers)
    );

    localStorage.setItem(
      "fitlogUserName",
      formData.name.trim()
    );

    setMessage("Profile updated successfully.");
  }

  const firstLetter =
    formData.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <section className="content-page">
      <header className="page-title">
        <h1>User Profile</h1>
        <p>Manage your personal and fitness information.</p>
      </header>

      <div className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-large-avatar">
            {firstLetter}
          </div>

          <h2>{formData.name || "FitLog User"}</h2>

          <p>{formData.email}</p>

          <div className="profile-goal-badge">
            {formData.fitnessGoal}
          </div>

          <div className="profile-details-list">
            <div>
              <span>Age</span>
              <strong>
                {formData.age ? `${formData.age} years` : "Not set"}
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
              <span>Weight</span>
              <strong>
                {formData.weight
                  ? `${formData.weight} lbs`
                  : "Not set"}
              </strong>
            </div>
          </div>
        </aside>

        <form
          className="profile-form-card"
          onSubmit={handleSubmit}
        >
          <div className="profile-form-header">
            <div>
              <h2>Edit Profile</h2>
              <p>
                Update your information and fitness goal.
              </p>
            </div>
          </div>

          {message && (
            <div
              className={
                message === "Profile updated successfully."
                  ? "profile-message success"
                  : "profile-message error"
              }
            >
              {message}
            </div>
          )}

          <div className="profile-form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

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
              <label htmlFor="email">Email</label>

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
              <label htmlFor="age">Age</label>

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

            <div className="form-group form-group-full">
              <label htmlFor="bio">
                Fitness Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                rows="5"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your fitness journey or goals..."
              />
            </div>
          </div>

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
