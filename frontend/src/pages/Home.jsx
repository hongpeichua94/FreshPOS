import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";

// COMPONENTS
import HeroBanner from "../components/HeroBanner";
import FruitCard from "../components/FruitCard";

// SCRIPTS
import { getInventoryInfo } from "../scripts/api";

const Home = (props) => {
  const userCtx = useContext(UserContext);
  const [overview, setOverview] = useState([]);

  const fetchInventoryInfo = async (accessToken) => {
    const inventoryInfo = await getInventoryInfo(accessToken);
    setOverview(inventoryInfo);
  };

  useEffect(() => {
    fetchInventoryInfo(userCtx.accessToken);
  }, [userCtx.accessToken]);

  return (
    <div>
      <HeroBanner></HeroBanner>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {overview.map((item) => {
          return (
            <FruitCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image_url={item.image_url}
              stocks={item.quantity - item.sold}
              fetchCartSummary={props.fetchCartSummary}
            ></FruitCard>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
