import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth.context";
import { SocketProvider } from "./contexts/socket.context";
import LoginPage from "./pages/loginpage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoutes";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/:roomId?"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}
