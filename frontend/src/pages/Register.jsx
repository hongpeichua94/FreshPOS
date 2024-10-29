import React, { useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import useFetch from "../hooks/useFetch";

// ANT DESIGN
import { Button, Form, Input, message } from "antd";

// MODULE CSS
import styles from "./Login.module.css";

const Login = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [accCreated, setAccCreated] = useState(false);
  const [allFields, setAllFields] = useState(false);
  const [error, setError] = useState("");

  const createAccount = async (values) => {
    const { email, password } = values;

    const confirmCreate = confirm(
      "Are you sure all fields are entered correctly?"
    );

    if (!confirmCreate) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetchData("/auth/register", "PUT", {
        email,
        password,
      });

      if (res.ok) {
        setAccCreated(true);
        setAllFields(false);
        setIsLoading(false);
        message.success("Account created");
        navigate("/login");
      } else {
        setError(JSON.stringify(res.data));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating new account", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={styles.login}>
      <h2 style={{ textAlign: "center" }}>Sign up for an account</h2>

      <div className={styles.form}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={createAccount}
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
          >
            <Input.Password />
          </Form.Item>
          <br />

          <Form.Item>
            <Button className={styles.button} type="primary" htmlType="submit">
              Register
            </Button>
            Back to <Link to="/login">Login</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
