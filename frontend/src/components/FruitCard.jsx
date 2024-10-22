import React, { useContext } from "react";
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
      console.log("User Token:", userCtx.accessToken);
      const res = await fetchData(
        "/api/cart",
        "PUT",
        { user_id: userCtx.userId, fruit_id: props.id, quantity: 1 },
        undefined,
        userCtx.accessToken
      );
      if (res.ok) {
        message.success(`Item added to cart!`);
      } else {
        console.error("Error adding item to cart:", res.data);
      }
    }
  };

  return (
    <Card
      style={{
        width: 300,
        margin: "30px",
        borderColor: "#000",
        borderWidth: "2px",
      }}
      cover={<img src={props.image_url} style={{ padding: "30px" }} />}
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
