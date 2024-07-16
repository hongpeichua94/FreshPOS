import React from "react";

import styles from "./HeroBanner.module.css";

const HeroBanner = () => {
  return (
    <div className={styles.herobanner}>
      <h1>Welcome To FreshFruits</h1>
      <h3>Fresh from Farm to You</h3>
    </div>
  );
};

export default HeroBanner;
