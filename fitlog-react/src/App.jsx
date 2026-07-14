import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AddWorkout from "./pages/AddWorkout";
import Dashboard from "./pages/Dashboard";
import EditWorkout from "./pages/EditWorkout";
import History from "./pages/History";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import "./styles/App.css";

function ProtectedLayout() {
  const isLoggedIn =
    localStorage.getItem("fitlogLoggedIn") === "true";

  const currentUserId =
    localStorage.getItem("fitlogCurrentUserId");

  if (!isLoggedIn || !currentUserId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/add-workout"
            element={<AddWorkout />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/progress"
            element={<Progress />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/edit-workout/:id"
            element={<EditWorkout />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
