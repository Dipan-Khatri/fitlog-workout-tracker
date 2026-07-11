import "../styles/App.css";

function Login() {
  return (
    <div className="login-page">

      <div className="left">

        <div className="login-box">

          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button>
            Sign In
          </button>

        </div>

      </div>

      <div className="right">

        <h1>FitLog</h1>

        <p>
          Track • Train • Improve
        </p>

      </div>

    </div>
  );
}

export default Login;
