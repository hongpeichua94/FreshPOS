import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UserContext from "../context/user";

import styles from "./NavBar.module.css";

import { Button } from "antd";

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
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          <h5>The FreshFruits Store</h5>
        </Link>
        <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          Hello, {accountDetails.first_name}!
          <UserOutlined style={{ fontSize: "28px", marginLeft: "10px" }} />
          <Link to="/cart">
            <ShoppingOutlined style={{ fontSize: "28px", margin: "10px" }} />
          </Link>
          <Link to="/order">
            <FileTextOutlined
              style={{ fontSize: "28px", marginRight: "10px" }}
              href="/"
            />
          </Link>
          <Button type="text" size="large" onClick={userCtx.logout}>
            Logout
          </Button>
        </p>
      </header>
    </>
  );
};

export default NavBar;
