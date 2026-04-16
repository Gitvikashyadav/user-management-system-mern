import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getMeApi, loginApi, logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  // Restore session on mount
  // useEffect(() => {
  //   const restore = async () => {
  //     const token = localStorage.getItem("accessToken");
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }
  //     try {
  //       const { data } = await getMeApi();
  //       setUser(data.data || data.user || data);
  //     } catch {
  //       localStorage.removeItem("accessToken");
  //       localStorage.removeItem("refreshToken");
  //       localStorage.removeItem("user");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   restore();
  // }, []);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getMeApi();

        setUser(data.data || data.user || data);
      } catch (err) {
        console.log("Restore failed:", err.response?.status);

        // ✅ Only logout if token is actually invalid
        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
        } else {
          // ✅ Keep user logged in (fallback to localStorage)
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await loginApi(credentials);
    const { accessToken, refreshToken, user: userData } = data.data || data;
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  }, []);

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isAdminOrManager = isAdmin || isManager;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAdmin,
        isManager,
        isAdminOrManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
