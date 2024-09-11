import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../context/user";

// ANT DESIGN
import { Button, Badge } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";

// MODULE CSS
import styles from "./NavBar.module.css";

// SCRIPTS
import { getAccountInfo, getCartSummary } from "../scripts/api";

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const [accountDetails, setAccountDetails] = useState({});
  const [cartQuantity, setCartQuantity] = useState([]);

  const fetchAccountData = async (userId, accessToken) => {
    const accountInfo = await getAccountInfo(userId, accessToken);
    setAccountDetails(accountInfo);
  };

  const fetchCartQuantity = async (userId, accessToken) => {
    const data = await getCartSummary(userId, accessToken);

    const quantity =
      Array.isArray(data) && data.length > 0 ? data[0].quantity : 0;

    setCartQuantity(quantity);
  };

  useEffect(() => {
    if (userCtx.userId) {
      fetchAccountData(userCtx.userId, userCtx.accessToken);
      fetchCartQuantity(userCtx.userId, userCtx.accessToken);
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
          <Link to="/profile">
            <UserOutlined style={{ fontSize: "28px", marginLeft: "10px" }} />
          </Link>
          <Link to="/cart">
            <Badge count={cartQuantity}>
              <ShoppingOutlined
                style={{ fontSize: "28px", marginLeft: "10px" }}
              />{" "}
            </Badge>
          </Link>
          <Link to="/order">
            <FileTextOutlined
              style={{
                fontSize: "28px",
                marginRight: "10px",
                marginLeft: " 15px",
              }}
              href="/"
            />
          </Link>
          {userCtx.role == "ADMIN" && (
            <Link to="/inventory">
              <UploadOutlined
                style={{ fontSize: "28px", marginLeft: "10px" }}
              />{" "}
            </Link>
          )}
          <Button type="text" size="large" onClick={userCtx.logout}>
            Logout
          </Button>
        </p>
      </header>
    </>
  );
};

export default NavBar;
