import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth.context";
import { SocketProvider } from "./contexts/socket.context";
import LoginPage from "./pages/login page";
import ChatPage from "./pages/chat page";
import ProtectedRoute from "./components/protected routes";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}
