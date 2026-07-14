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

  function changeMode(nextMode) {
    setMode(nextMode);

    setMessage({
      type: "",
      text: "",
    });

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const checks = getPasswordChecks(password);

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

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "The passwords do not match.",
      });

      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("fitlogUsers")) || [];

    const emailAlreadyExists = existingUsers.some(
      (user) =>
        user.email.toLowerCase() ===
        formData.email.trim().toLowerCase()
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
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "fitlogUsers",
      JSON.stringify([...existingUsers, newUser])
    );

    setMode("signin");

    setFormData({
      name: "",
      email: newUser.email,
      password: "",
      confirmPassword: "",
    });

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

    const savedUsers =
      JSON.parse(localStorage.getItem("fitlogUsers")) || [];

    const matchedUser = savedUsers.find(
      (user) =>
        user.email.toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        user.password === formData.password
    );

    if (!matchedUser) {
      setMessage({
        type: "error",
        text: "Incorrect email or password.",
      });

      return;
    }

    localStorage.setItem("fitlogLoggedIn", "true");
    localStorage.setItem("fitlogCurrentUserId", matchedUser.id);
    localStorage.setItem("fitlogUserEmail", matchedUser.email);
    localStorage.setItem("fitlogUserName", matchedUser.name);

    navigate("/dashboard");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "signup") {
      handleCreateAccount();
    } else {
      handleSignIn();
    }
  }

  const passwordChecks = getPasswordChecks(formData.password);

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

        <div className="auth-tabs">
          <button
            type="button"
            className={
              mode === "signin"
                ? "auth-tab active"
                : "auth-tab"
            }
            onClick={() => changeMode("signin")}
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
            onClick={() => changeMode("signup")}
          >
            Create Account
          </button>
        </div>

        <h1>
          {mode === "signin"
            ? "Welcome to FitLog"
            : "Create Your Account"}
        </h1>

        <p className="login-subtitle">
          {mode === "signin"
            ? "Sign in to continue tracking your workouts."
            : "Create an account to begin your fitness journey."}
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

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label htmlFor="name">Full Name</label>

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

          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete={
              mode === "signin"
                ? "current-password"
                : "new-password"
            }
          />

          {mode === "signup" && (
            <>
              <div className="password-requirements">
                <p>Password requirements</p>

                <span
                  className={
                    passwordChecks.length ? "valid" : ""
                  }
                >
                  {passwordChecks.length ? "✓" : "○"} At least 8
                  characters
                </span>

                <span
                  className={
                    passwordChecks.uppercase ? "valid" : ""
                  }
                >
                  {passwordChecks.uppercase ? "✓" : "○"} One
                  uppercase letter
                </span>

                <span
                  className={
                    passwordChecks.lowercase ? "valid" : ""
                  }
                >
                  {passwordChecks.lowercase ? "✓" : "○"} One
                  lowercase letter
                </span>

                <span
                  className={
                    passwordChecks.number ? "valid" : ""
                  }
                >
                  {passwordChecks.number ? "✓" : "○"} One number
                </span>

                <span
                  className={
                    passwordChecks.special ? "valid" : ""
                  }
                >
                  {passwordChecks.special ? "✓" : "○"} One special
                  character
                </span>
              </div>

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </>
          )}

          <button className="sign-in-button" type="submit">
            {mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p className="switch-auth-text">
          {mode === "signin"
            ? "Do not have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="switch-auth-button"
            onClick={() =>
              changeMode(
                mode === "signin" ? "signup" : "signin"
              )
            }
          >
            {mode === "signin"
              ? "Create one"
              : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
