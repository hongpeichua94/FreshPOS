import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
import { Button, Form, Input, Typography } from "antd";

// MODULE CSS
import styles from "./Login.module.css";

const Login = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleLogin = async () => {
    const res = await fetchData("/auth/login", "POST", { email, password });

    if (res.ok) {
      userCtx.setAccessToken(res.data.access);
      userCtx.setUserId(res.data.user_id);
      userCtx.setRole(res.data.role);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("role", res.data.role);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  return (
    <div className={styles.login}>
      <h2 style={{ textAlign: "center" }}>Sign in to your account</h2>

      <div className={styles.form}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            <Input.Password />
          </Form.Item>
          <br />
          <Form.Item>
            <Button
              className={styles.button}
              type="primary"
              htmlType="submit"
              onClick={handleLogin}
            >
              Log in
            </Button>
            No account? <Link to="/register">Register now</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
