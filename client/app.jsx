import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/auth.context";
import Login from "./pages/LoginPage";
import Register from "./pages/Register";
import Chat from "./pages/ChatPage";

function App() {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users away from login/register pages */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />

        {/* Protect chat routes, redirect to login if not authenticated */}
        <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
