import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/user";

import NavBar from "../components/NavBar";
import HeroBanner from "../components/HeroBanner";
import FruitCard from "../components/FruitCard";

import { getInventoryInfo } from "../scripts/api";

const Home = () => {
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
      <NavBar></NavBar>
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
              fetchInventoryInfo={fetchInventoryInfo}
            ></FruitCard>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
