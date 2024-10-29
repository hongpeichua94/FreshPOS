import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import UserContext from "./context/user";

// COMPONENTS
import NavBar from "./components/NavBar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/AllOrders";
import Profile from "./pages/Profile";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";

// SCRIPTS
import { getAccountInfo, getCartSummary } from "./scripts/api";

function App() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const [accountDetails, setAccountDetails] = useState({});
  const [cartQuantity, setCartQuantity] = useState([]);
  const [cartSummary, setCartSummary] = useState([]);

  const fetchAccountData = async (userId, accessToken) => {
    const accountInfo = await getAccountInfo(userId, accessToken);
    setAccountDetails(accountInfo);
  };

  const fetchCartSummary = async (userId, accessToken) => {
    const data = await getCartSummary(userId, accessToken);
    setCartSummary(data);

    const quantity =
      Array.isArray(data) && data.length > 0 ? data[0].quantity : 0;
    setCartQuantity(quantity);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    setAccessToken("");
    setUserId("");
    setRole("");
    localStorage.clear();
    navigate("/");
  };

  // Load user data from localStorage when the app first loads because app state reset upon refresh
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("role");

    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedUserId) {
      setUserId(storedUserId);
      fetchAccountData(storedUserId);
      fetchCartSummary(storedUserId);
    }
    if (storedRole) setRole(storedRole);
  }, [userId, accessToken]);

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
    logout: handleLogout,
  };

  // converting accessToken value to a boolean to see if user is logged in
  const isLoggedIn = !!accessToken;

  return (
    <UserContext.Provider value={userContextValue}>
      <NavBar
        accountDetails={accountDetails}
        cartQuantity={cartQuantity}
      ></NavBar>
      <Routes>
        <Route
          path="/"
          element={<Home fetchCartSummary={fetchCartSummary} />}
        />
        {/* Logged out */}
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        {/* Logged out */}

        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart
                userId={userId}
                cartSummary={cartSummary}
                fetchCartSummary={fetchCartSummary}
              />
            ) : (
              <Navigate to="/login" />
            )
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
            isLoggedIn ? (
              <Profile userId={userId} fetchAccountData={fetchAccountData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/inventory"
          element={
            isLoggedIn && role == "ADMIN" ? (
              <Inventory />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
