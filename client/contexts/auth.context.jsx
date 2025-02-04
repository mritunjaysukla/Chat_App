import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await axios.get("/api/auth/login", {
        withCredentials: true,
      });
      return data.user;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post("/api/auth/login", formData, {
        withCredentials: true,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
