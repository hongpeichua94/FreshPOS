import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
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

const NavBar = (props) => {
  const userCtx = useContext(UserContext);

  return (
    <>
      <header className={styles.navbar}>
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h5>The FreshFruits Store</h5>
        </NavLink>

        <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          {!userCtx.userId ? (
            // Show login and sign up if user is null
            <div>
              <NavLink to="/login">
                <Button type="primary" style={{ marginRight: "5px" }}>
                  Login
                </Button>
              </NavLink>

              <NavLink to="/register">
                <Button type="default">Sign Up</Button>
              </NavLink>
            </div>
          ) : (
            <>
              Hello, {props.accountDetails.first_name}!
              <NavLink to="/profile">
                <UserOutlined
                  style={{ fontSize: "28px", marginLeft: "10px" }}
                />
              </NavLink>
              <NavLink to="/cart">
                <Badge count={props.cartQuantity}>
                  <ShoppingOutlined
                    style={{ fontSize: "28px", marginLeft: "10px" }}
                  />{" "}
                </Badge>
              </NavLink>
              <NavLink to="/order">
                <FileTextOutlined
                  style={{
                    fontSize: "28px",
                    marginRight: "10px",
                    marginLeft: "15px",
                  }}
                />
              </NavLink>
              {userCtx.role == "ADMIN" && (
                <NavLink to="/inventory">
                  <UploadOutlined
                    style={{ fontSize: "28px", marginRight: "10px" }}
                  />{" "}
                </NavLink>
              )}
              <Button danger onClick={userCtx.logout}>
                Logout
              </Button>
            </>
          )}
        </p>
      </header>
    </>
  );
};

export default NavBar;
