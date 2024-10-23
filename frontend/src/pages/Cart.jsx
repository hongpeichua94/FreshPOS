import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
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

// SCRIPTS
import { getCartDetail, getCartSummary } from "../scripts/api";

const { Content } = Layout;

const Cart = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
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
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => decrement(record.uuid)}
            disabled={record.quantity <= 1}
          >
            -
          </Button>
          <span style={{ margin: "0 8px" }}>{record.quantity}</span>
          <Button
            onClick={() => increment(record.uuid)}
            disabled={record.quantity >= 10}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      width: "15%",
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
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

  const increment = async (uuid) => {
    const updatedItems = cartItems.map((item) =>
      item.uuid === uuid ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
    // Optionally, send update to server
    await updateCartQuantity(
      uuid,
      updatedItems.find((item) => item.uuid === uuid).quantity
    );
  };

  const decrement = async (uuid) => {
    const updatedItems = cartItems.map((item) =>
      item.uuid === uuid && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
    // Optionally, send update to server
    await updateCartQuantity(
      uuid,
      updatedItems.find((item) => item.uuid === uuid).quantity
    );
  };

  const updateCartQuantity = async (uuid, newQuantity) => {
    try {
      const res = await fetchData(
        "/api/cart/items",
        "PATCH",
        { uuid: uuid, quantity: newQuantity },
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        await fetchCartDetail(userCtx.userId, userCtx.accessToken);
        await props.fetchCartSummary(userCtx.userId, userCtx.accessToken);
      } else {
        console.error(res.data);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

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
      await props.fetchCartSummary(userCtx.userId, userCtx.accessToken);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
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
        message.success("Order submitted!");
        await props.fetchCartSummary(userCtx.userId, userCtx.accessToken);
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
      props.fetchCartSummary(userCtx.userId, userCtx.accessToken);
    }
  }, [userCtx.userId, userCtx.accessToken]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div>
      <Content
        style={{
          margin: "10px 16px",
          display: "flex",
          width: "100vw",
          gap: "16px",
        }}
      >
        <div
          style={{
            padding: 50,
            minHeight: "90vh",
            flex: "0.7",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Divider orientation="center">My Shopping Cart</Divider>
          <Table
            columns={cartColumns}
            dataSource={cartItems}
            pagination={tableParams.pagination}
            loading={loading}
          />
        </div>
        <div
          style={{
            padding: 50,
            minHeight: "90vh",
            flex: "0.2",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Divider orientation="center">Cart Summary</Divider>
          <List
            className="cart-summary"
            itemLayout="horizontal"
            dataSource={props.cartSummary}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={`Total (inc. tax): $${(item.total ?? 0).toFixed(2)}`}
                  description={`Subtotal: $${(item.subtotal ?? 0).toFixed(2)}`}
                />
              </List.Item>
            )}
          />
          <br></br>
          <Link to="/order">
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
