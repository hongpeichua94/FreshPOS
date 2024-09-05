import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// COMPONENTS
import CreateAccountModal from "../components/CreateAccountModal";

// ANT DESIGN
import { Button, Form, Input, Typography } from "antd";

// MODULE CSS
import styles from "./Login.module.css";

const { Title } = Typography;

const Login = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
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
      // const decoded = jwtDecode(res.data.access);
      // userCtx.setRole(decoded.role);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  const createModal = () => {
    setShowCreateAccountModal(true);
  };

  return (
    <>
      {showCreateAccountModal && (
        <CreateAccountModal
          setShowCreateAccountModal={setShowCreateAccountModal}
        ></CreateAccountModal>
      )}

      <div className={styles.login}>
        <Title style={{ textAlign: "center" }}>Welcome to FreshFruits</Title>

        <div className={styles.loginform}>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
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
                className={styles.loginButton}
                type="primary"
                htmlType="submit"
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button
                className={styles.signupButton}
                type="seconday"
                htmlType="submit"
                onClick={createModal}
              >
                No account? Sign up for free
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Login;
