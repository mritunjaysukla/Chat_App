import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create AuthContext to provide authentication-related values across the app
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch the current authenticated user from the server
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/auth/currentUser", {
          withCredentials: true, // Send cookies for authentication
        });
        return data.user;
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error); // Debugging log
        return null; // Return null if no user is authenticated
      }
    },
    retry: false, // Don't retry on failure
    onError: () => {
      toast.error("Failed to fetch user data.");
    },
    enabled: false, // Disable the query initially
  });

  // Handle user login mutation
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData, {
        withCredentials: true, // Allows cookies and sessions
      });
      return data;
    },
  });

  // Handle user logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null); // Reset user data after logout
      toast.success("Logged out successfully");
    },
    onError: () => toast.error("Error logging out"),
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        refetch,
        login: loginMutation.mutateAsync, // Login method
        logout: logoutMutation.mutateAsync, // Logout method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context in the app
export const useAuth = () => useContext(AuthContext);
