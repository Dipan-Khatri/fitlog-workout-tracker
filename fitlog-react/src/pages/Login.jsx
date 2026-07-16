import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  function getSavedUsers() {
    try {
      return (
        JSON.parse(
          localStorage.getItem("fitlogUsers")
        ) || []
      );
    } catch (error) {
      console.error(
        "Unable to load FitLog users:",
        error
      );

      return [];
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  }

  function clearForm() {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function changeMode(nextMode) {
    setMode(nextMode);

    setMessage({
      type: "",
      text: "",
    });

    clearForm();
  }

  function openForgotPassword() {
    setMode("forgot");

    setMessage({
      type: "",
      text: "",
    });

    setFormData((currentData) => ({
      ...currentData,
      name: "",
      password: "",
      confirmPassword: "",
    }));

    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }

  function getPasswordChecks(password) {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }

  function passwordIsValid(password) {
    const checks =
      getPasswordChecks(password);

    return Object.values(checks).every(Boolean);
  }

  function handleCreateAccount() {
    if (!formData.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your full name.",
      });

      return;
    }

    if (!validateEmail(formData.email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });

      return;
    }

    if (!passwordIsValid(formData.password)) {
      setMessage({
        type: "error",
        text: "Your password does not meet all requirements.",
      });

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "The passwords do not match.",
      });

      return;
    }

    const existingUsers = getSavedUsers();

    const normalizedEmail =
      formData.email.trim().toLowerCase();

    const emailAlreadyExists =
      existingUsers.some(
        (user) =>
          String(user.email).toLowerCase() ===
          normalizedEmail
      );

    if (emailAlreadyExists) {
      setMessage({
        type: "error",
        text: "An account with this email already exists.",
      });

      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      email: normalizedEmail,
      password: formData.password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "fitlogUsers",
      JSON.stringify([
        ...existingUsers,
        newUser,
      ])
    );

    setMode("signin");

    setFormData({
      name: "",
      email: newUser.email,
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);

    setMessage({
      type: "success",
      text: "Account created successfully. You can now sign in.",
    });
  }

  function handleSignIn() {
    if (!validateEmail(formData.email)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });

      return;
    }

    if (!formData.password.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your password.",
      });

      return;
    }

   const savedUsers = getSavedUsers();

const normalizedEmail =
  formData.email.trim().toLowerCase();

const demoUser = {
  id: "fitlog-demo-user",
  name: "FitLog Demo",
  email: "demo@fitlog.com",
  password: "FitLog@123",
};

let matchedUser;

if (
  normalizedEmail === demoUser.email &&
  formData.password === demoUser.password
) {
  matchedUser = demoUser;
} else {
  matchedUser = savedUsers.find(
    (user) =>
      String(user.email).toLowerCase() ===
        normalizedEmail &&
      user.password === formData.password
  );
}

    if (matchedUser.id === "fitlog-demo-user") {
  const demoWorkoutKey =
    "fitlogWorkouts_fitlog-demo-user";

  const existingDemoWorkouts =
    JSON.parse(
      localStorage.getItem(demoWorkoutKey)
    ) || [];

  if (existingDemoWorkouts.length === 0) {
    const demoWorkouts = [
      {
        id: "demo-workout-1",
        workoutName: "Chest Day",
        exerciseName: "Bench Press",
        date: new Date().toISOString().split("T")[0],
        duration: 60,
        sets: 4,
        reps: 10,
        weight: 135,
        notes:
          "Warm up first and focus on controlled repetitions.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "demo-workout-2",
        workoutName: "Leg Day",
        exerciseName: "Squat",
        date: new Date(
          Date.now() - 86400000
        )
          .toISOString()
          .split("T")[0],
        duration: 70,
        sets: 4,
        reps: 8,
        weight: 155,
        notes:
          "Maintain proper depth and controlled form.",
        createdAt: new Date(
          Date.now() - 86400000
        ).toISOString(),
      },
    ];

    localStorage.setItem(
      demoWorkoutKey,
      JSON.stringify(demoWorkouts)
    );
  }
}


    localStorage.setItem(
      "fitlogLoggedIn",
      "true"
    );

    localStorage.setItem(
      "fitlogCurrentUserId",
      matchedUser.id
    );

    localStorage.setItem(
      "fitlogUserEmail",
      matchedUser.email
    );

    localStorage.setItem(
      "fitlogUserName",
      matchedUser.name
    );

    navigate("/dashboard");
  }

  function handlePasswordReset() {
    if (!validateEmail(formData.email)) {
      setMessage({
        type: "error",
        text: "Please enter your registered email address.",
      });

      return;
    }

    if (!passwordIsValid(formData.password)) {
      setMessage({
        type: "error",
        text: "Your new password does not meet all requirements.",
      });

      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "The new passwords do not match.",
      });

      return;
    }

    const savedUsers = getSavedUsers();

    const normalizedEmail =
      formData.email.trim().toLowerCase();

    const userExists = savedUsers.some(
      (user) =>
        String(user.email).toLowerCase() ===
        normalizedEmail
    );

    if (!userExists) {
      setMessage({
        type: "error",
        text: "No FitLog account was found with that email.",
      });

      return;
    }

    const updatedUsers = savedUsers.map(
      (user) =>
        String(user.email).toLowerCase() ===
        normalizedEmail
          ? {
              ...user,
              password: formData.password,
              passwordUpdatedAt:
                new Date().toISOString(),
            }
          : user
    );

    localStorage.setItem(
      "fitlogUsers",
      JSON.stringify(updatedUsers)
    );

    setMode("signin");

    setFormData({
      name: "",
      email: normalizedEmail,
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);

    setMessage({
      type: "success",
      text: "Password reset successfully. Sign in with your new password.",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "signup") {
      handleCreateAccount();
      return;
    }

    if (mode === "forgot") {
      handlePasswordReset();
      return;
    }

    handleSignIn();
  }

  const passwordChecks =
    getPasswordChecks(formData.password);

  const heading =
    mode === "signin"
      ? "Welcome to FitLog"
      : mode === "signup"
      ? "Create Your Account"
      : "Reset Your Password";

  const subtitle =
    mode === "signin"
      ? "Sign in to continue tracking your workouts."
      : mode === "signup"
      ? "Create an account to begin your fitness journey."
      : "Enter your registered email and create a new password.";

  const submitText =
    mode === "signin"
      ? "Sign In"
      : mode === "signup"
      ? "Create Account"
      : "Reset Password";

  return (
    <main className="fitlog-login-page">
      <div className="login-circle login-circle-top" />
      <div className="login-circle login-circle-bottom" />

      <section className="fitlog-login-card">
        <img
          src="/fitlog-logo.png"
          alt="FitLog logo"
          className="fitlog-login-logo"
        />

        {mode !== "forgot" && (
          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === "signin"
                  ? "auth-tab active"
                  : "auth-tab"
              }
              onClick={() =>
                changeMode("signin")
              }
            >
              Sign In
            </button>

            <button
              type="button"
              className={
                mode === "signup"
                  ? "auth-tab active"
                  : "auth-tab"
              }
              onClick={() =>
                changeMode("signup")
              }
            >
              Create Account
            </button>
          </div>
        )}

        {mode === "forgot" && (
          <button
            type="button"
            className="forgot-back-button"
            onClick={() =>
              changeMode("signin")
            }
          >
            ← Back to Sign In
          </button>
        )}

        <h1>{heading}</h1>

        <p className="login-subtitle">
          {subtitle}
        </p>

        {message.text && (
          <div
            className={
              message.type === "success"
                ? "auth-message success"
                : "auth-message error"
            }
          >
            {message.text}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          {mode === "signup" && (
            <>
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
                autoComplete="name"
              />
            </>
          )}

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            autoComplete="email"
          />

          <label htmlFor="password">
            {mode === "forgot"
              ? "New Password"
              : "Password"}
          </label>

          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              placeholder={
                mode === "forgot"
                  ? "Enter a new password"
                  : "Enter your password"
              }
              autoComplete={
                mode === "signin"
                  ? "current-password"
                  : "new-password"
              }
            />

            <button
              type="button"
              className="password-visibility-button"
              onClick={() =>
                setShowPassword(
                  (currentValue) =>
                    !currentValue
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              title={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {(mode === "signup" ||
            mode === "forgot") && (
            <>
              <div className="password-requirements">
                <p>Password requirements</p>

                <span
                  className={
                    passwordChecks.length
                      ? "valid"
                      : ""
                  }
                >
                  {passwordChecks.length
                    ? "✓"
                    : "○"}{" "}
                  At least 8 characters
                </span>

                <span
                  className={
                    passwordChecks.uppercase
                      ? "valid"
                      : ""
                  }
                >
                  {passwordChecks.uppercase
                    ? "✓"
                    : "○"}{" "}
                  One uppercase letter
                </span>

                <span
                  className={
                    passwordChecks.lowercase
                      ? "valid"
                      : ""
                  }
                >
                  {passwordChecks.lowercase
                    ? "✓"
                    : "○"}{" "}
                  One lowercase letter
                </span>

                <span
                  className={
                    passwordChecks.number
                      ? "valid"
                      : ""
                  }
                >
                  {passwordChecks.number
                    ? "✓"
                    : "○"}{" "}
                  One number
                </span>

                <span
                  className={
                    passwordChecks.special
                      ? "valid"
                      : ""
                  }
                >
                  {passwordChecks.special
                    ? "✓"
                    : "○"}{" "}
                  One special character
                </span>
              </div>

              <label htmlFor="confirmPassword">
                {mode === "forgot"
                  ? "Confirm New Password"
                  : "Confirm Password"}
              </label>

              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder={
                    mode === "forgot"
                      ? "Re-enter your new password"
                      : "Re-enter your password"
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-visibility-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (currentValue) =>
                        !currentValue
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmed password"
                      : "Show confirmed password"
                  }
                  title={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>
              </div>
            </>
          )}

          {mode === "signin" && (
            <button
              type="button"
              className="forgot-password-button"
              onClick={openForgotPassword}
            >
              Forgot password?
            </button>
          )}

          <button
            className="sign-in-button"
            type="submit"
          >
            {submitText}
          </button>
        </form>

        {mode !== "forgot" && (
          <p className="switch-auth-text">
            {mode === "signin"
              ? "Do not have an account?"
              : "Already have an account?"}

            <button
              type="button"
              className="switch-auth-button"
              onClick={() =>
                changeMode(
                  mode === "signin"
                    ? "signup"
                    : "signin"
                )
              }
            >
              {mode === "signin"
                ? "Create one"
                : "Sign in"}
            </button>
          </p>
        )}

        {mode === "forgot" && (
          <p className="password-reset-notice">
            This class-project version resets the
            password stored in this browser. It does
            not send an email.
          </p>
        )}
      </section>
    </main>
  );
}

export default Login;
