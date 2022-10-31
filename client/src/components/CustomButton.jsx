import React from "react";

import styles from "../styles";

const CustomButton = ({ title, handleClick, restStyles }) => {
  return (
    <button onClick={handleClick} className={`${styles.btn} ${restStyles}`}>
      {title}
    </button>
  );
};

export default CustomButton;
