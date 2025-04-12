"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(null); 
  const [credit, setCredit] = useState(false);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);  
      } else {
        toast.error("Failed to load credits");
      }
    } catch (error) {
      console.log("Error loading credits:", error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };
  
  const generateImage = async(prompt) => {
    try {
      const{data} = await axios.post(`${backendUrl}/image/generate-image`,{prompt}, {        
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        loadCreditsData();
        if(data.creditBalance === 0) {
          router.push('/buy');
        }
        console.log('Generated image:', data.resultImage);
        
        return data.image
      }
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully!");
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
