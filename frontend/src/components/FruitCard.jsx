import React, { useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

// ANT DESIGN
import { Card, Button, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const FruitCard = (props) => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const handleAddToCart = async () => {
    if (!userCtx.userId) {
      navigate("/login");
    } else {
      const res = await fetchData(
        "/api/cart",
        "PUT",
        { user_id: userCtx.userId, fruit_id: props.id, quantity: 1 },
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        message.success(`Item added to cart!`);
        await props.fetchCartSummary(userCtx.userId, userCtx.accessToken); // Fetch the cart summary after adding the item
      } else {
        console.error("Error adding item to cart:", res.data);
      }
    }
  };

  useEffect(() => {
    if (userCtx.userId) {
      props.fetchCartSummary(userCtx.userId, userCtx.accessToken);
    }
  }, [userCtx.userId, userCtx.accessToken]);

  return (
    <Card
      style={{
        width: 300,
        margin: "30px",
        borderColor: "#000",
        borderWidth: "2px",
      }}
      cover={
        <img
          loading="lazy"
          crossOrigin="anonymous" // image fetched without sending cookies or HTTP authentication
          // src={`https://freshpos.onrender.com${props.image}`}
          src={`http://localhost:5001${props.image}`}
          style={{ padding: "30px" }}
        />
      }
      actions={[
        <Button
          type="primary"
          shape="round"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>,
      ]}
    >
      <Meta
        title={`${props.name} ($${props.price.toFixed(2)} /qty)`}
        description={props.description}
      />
      <br></br>
      <Meta
        description={
          <div style={{ textAlign: "right" }}>{props.stocks} stocks</div>
        }
      />
    </Card>
  );
};

export default FruitCard;
