import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

import {
  Button,
  Divider,
  Layout,
  Table,
  List,
  Space,
  theme,
  message,
} from "antd";

import { getCartDetail, getCartSummary } from "../scripts/api";
import NavBar from "../components/NavBar";

const { Content, Sider } = Layout;

const Cart = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const cartColumns = [
    {
      title: "Item",
      dataIndex: "name",
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "30%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: "15%",
    },
    {
      title: "Subtotal ($)",
      dataIndex: "subtotal",
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <a
            style={{ color: "#FF6C64" }}
            onClick={() => removeFromCart(record.uuid)}
          >
            Remove from Cart
          </a>
        </Space>
      ),
    },
  ];

  const fetchCartDetail = async (userId, accessToken) => {
    setLoading(true); // Set loading the true while data is being fetched
    try {
      const data = await getCartDetail(userId, accessToken);
      setCartItems(data);
      setLoading(false);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: data.totalCount,
        },
      });
    } catch (error) {
      console.error("Error fetching cart items :", error);
    }
  };

  const removeFromCart = async (uuid) => {
    const res = await fetchData(
      "/api/cart",
      "DELETE",
      { uuid: uuid },
      userCtx.accessToken
    );

    if (res.ok) {
      message.success("Item removed from cart");
      await fetchCartDetail(userCtx.userId, userCtx.accessToken);
      await fetchCartSummary(userCtx.userId, userCtx.accessToken);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  const fetchCartSummary = async (userId, accessToken) => {
    const data = await getCartSummary(userId, accessToken);
    setCartSummary(data);
  };

  const submitOrder = async () => {
    try {
      const res = await fetchData(
        "/api/order/new",
        "PUT",
        {
          user_id: userCtx.userId,
        },
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        message.success(`Order submitted!`);
      } else {
        console.error("Error submitting order:", res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userCtx.userId) {
      fetchCartDetail(userCtx.userId, userCtx.accessToken);
      fetchCartSummary(userCtx.userId, userCtx.accessToken);
    }
  }, [userCtx.userId, userCtx.accessToken]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <NavBar></NavBar>
      <Content
        style={{
          margin: "10px 16px",
          display: "flex",
          gap: "16px",
        }}
      >
        <div
          style={{
            padding: 50,
            minHeight: "90vh",
            maxWidth: "60vw",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Divider orientation="center">My Shopping Cart</Divider>
          <Table
            columns={cartColumns}
            // rowKey={(record) => record.uuid}
            dataSource={cartItems}
            pagination={tableParams.pagination}
            loading={loading}
            // onChange={handleTableChange}
          />
        </div>
        <div
          style={{
            padding: 50,
            minHeight: "90vh",
            maxWidth: "40vw",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Divider orientation="center">Cart Summary</Divider>
          <List
            className="cart-summary"
            itemLayout="horizontal"
            dataSource={cartSummary}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={`Total (inc. tax): $${item.total}`}
                  description={`Subtotal: $${item.subtotal}`}
                />
              </List.Item>
            )}
          />
          <br></br>
          <Link to="/home">
            <Button type="primary" shape="round" onClick={submitOrder}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </Content>
    </div>
  );
};

export default Cart;
