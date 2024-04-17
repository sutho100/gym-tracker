import { createContext, useContext, useState } from "react";

type AuthContextType = {
  username: string;
  setUsername: (username: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  username: "",
  setUsername: (username) => {},
});

const AuthContextProvider = ({ children }) => {
  const [username, setUsername] = useState<string>("");

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => useContext(AuthContext);
