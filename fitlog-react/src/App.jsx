import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AddWorkout from "./pages/AddWorkout";
import EditWorkout from "./pages/EditWorkout";
import History from "./pages/History";
import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/history" replace />}
        />

        <Route path="/history" element={<History />} />

        <Route path="/add-workout" element={<AddWorkout />} />

        <Route
          path="/edit-workout/:id"
          element={<EditWorkout />}
        />

        <Route
          path="*"
          element={<Navigate to="/history" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 