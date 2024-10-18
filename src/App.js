import React from "react";
import { ToastContainer } from "react-toastify";

import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UserProvider } from "./context/UserContext";
import AppRouter from "./router/AppRouter";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <>
        <UserProvider>
          <AppRouter />
        </UserProvider>
     

      <ToastContainer position="bottom-right" className="custom-toast-container" />
    </>
  );
}

export default App;
