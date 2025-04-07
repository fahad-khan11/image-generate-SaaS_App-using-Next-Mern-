"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(null); 
  const [credit, setCredit] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);  
    }
  }, []); 

  const value = {
    user, setUser, showLogin, setShowLogin, backendUrl, token, setToken, credit, setCredit
  };

  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
