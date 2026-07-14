import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");

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
  }

  function passwordIsValid(password) {
    const hasEightCharacters = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    return (
      hasEightCharacters &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialCharacter
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    if (mode === "signup") {
      if (!formData.name.trim()) {
        alert("Please enter your name.");
        return;
      }

      if (!passwordIsValid(formData.password)) {
        alert(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      localStorage.setItem("fitlogUser", JSON.stringify(newUser));

      alert("Account created successfully. You can now sign in.");

      setMode("signin");

      setFormData({
        name: "",
        email: formData.email,
        password: "",
        confirmPassword: "",
      });

      return;
    }

    const savedUser = JSON.parse(
      localStorage.getItem("fitlogUser")
    );

    if (
      savedUser &&
      (savedUser.email !== formData.email ||
        savedUser.password !== formData.password)
    ) {
      alert("Incorrect email or password.");
      return;
    }

    localStorage.setItem("fitlogLoggedIn", "true");
    localStorage.setItem("fitlogUserEmail", formData.email);

    if (savedUser?.name) {
      localStorage.setItem("fitlogUserName", savedUser.name);
    } else {
      localStorage.setItem("fitlogUserName", "User");
    }

    navigate("/dashboard");
  }

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
            onClick={() => setMode("signin")}
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
            onClick={() => setMode("signup")}
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
            : "Create an account to start your fitness journey."}
        </p>

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
                <p>Password must include:</p>
                <span>• At least 8 characters</span>
                <span>• One uppercase letter</span>
                <span>• One lowercase letter</span>
                <span>• One number</span>
                <span>• One special character</span>
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
              setMode(
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
