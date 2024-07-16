import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import UserContext from "./context/user";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/AllOrders";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedUserId) setUserId(storedUserId);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    setAccessToken("");
    setUserId("");
    setRole("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const userContextValue = {
    accessToken,
    setAccessToken: (token) => {
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    },
    userId,
    setUserId: (id) => {
      setUserId(id);
      localStorage.setItem("userId", id);
    },
    role,
    setRole: (role) => {
      setRole(role);
      localStorage.setItem("role", role);
    },
    logout: handleLogout, // Add logout function to context value
  };

  // converting accessToken value to a boolean to see if user is logged in
  const isLoggedIn = !!accessToken;

  return (
    <UserContext.Provider value={userContextValue}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home userId={userId} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/cart"
          element={
            isLoggedIn ? <Cart userId={userId} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/order"
          element={
            isLoggedIn ? (
              role === "ADMIN" ? (
                <AllOrders />
              ) : (
                <MyOrders userId={userId} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile userId={userId} /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
