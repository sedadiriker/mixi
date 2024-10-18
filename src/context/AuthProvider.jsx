import { createContext, useContext, useState } from "react";
import { auth } from "../auth/firebase";
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toastSuccessNotify, toastErrorNotify } from "../helper/ToastNotify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || false
  );
  const navigate = useNavigate();

  const googleProvider = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const username = user.displayName || user.email.split('@')[0]; 
        localStorage.setItem('username', username); 
        navigate("/");
        toastSuccessNotify("Logged in successfully");
      })
      .catch((error) => {
        toastErrorNotify(error.message);
      });
  }
  
  const facebookProvider = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const username = user.displayName || user.email.split('@')[0]; 
        localStorage.setItem('username', username); 
        navigate("/");
        toastSuccessNotify("Logged in successfully");
      })
      .catch((error) => {
        toastErrorNotify(error.message);
      });
  }
  

  const values = { currentUser, googleProvider, facebookProvider };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
