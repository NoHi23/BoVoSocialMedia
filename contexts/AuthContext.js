import { createContext, useContext, useState } from "react";

const AuthContext = createContext(); // Create the AuthContext

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold user information

  const setAuth = (authUser) => {
    setUser(authUser); // Nhận một authUser (ví dụ: object thông tin user từ Supabase) và gán trực tiếp vào user.
  };

  const setUserData = (userData) => {
    //console.log('old user: ', user);
    setUser({ ...userData }); // Dùng để cập nhật user bằng một object mới (có thể lấy từ DB, ví dụ: name, avatar,...).
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Custom hook to use AuthContext
