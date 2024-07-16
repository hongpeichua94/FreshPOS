import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UserContext from "../context/user";

import styles from "./NavBar.module.css";

import {
  UserOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import { getAccountInfo } from "../scripts/api";

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const [accountDetails, setAccountDetails] = useState({});

  const fetchAccountData = async (userId, accessToken) => {
    const accountInfo = await getAccountInfo(userId, accessToken);
    setAccountDetails(accountInfo);
  };

  useEffect(() => {
    if (userCtx.userId) {
      fetchAccountData(userCtx.userId, userCtx.accessToken);
    }
  }, [userCtx.userId, userCtx.accessToken]);

  return (
    <>
      <header className={styles.navbar}>
        <Link to="/home">
          <h5>FreshFruits</h5>
        </Link>
        <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <UserOutlined style={{ fontSize: "28px", marginRight: "10px" }} />
          Hello, {accountDetails.first_name}!
          <Link to="/cart">
            <ShoppingOutlined style={{ fontSize: "28px", margin: "10px" }} />
          </Link>
          <Link to="/cart">
            <FileTextOutlined
              style={{ fontSize: "28px", marginRight: "15px" }}
              href="/"
            />
          </Link>
          <button onClick={userCtx.logout}>Logout</button>
        </p>
      </header>
    </>
  );
};

export default NavBar;
