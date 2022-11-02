import React from "react";
import { useNavigate } from "react-router-dom";

import { Alert } from "../components";
import { useGlobalContext } from "../context";
import { battlegrounds } from "../assets";
import styles from "../styles";

const Battleground = () => {
  const { showAlert, setShowAlert, setBattleground } = useGlobalContext();
  const navigate = useNavigate();

  const handleBattlegroundChoice = (ground) => {
    setBattleground(ground.id);
    localStorage.setItem("battleground", ground.id);
    setShowAlert({
      status: true,
      type: "info",
      message: `${ground.name} is ready for battle!`,
    });

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <h1 className={`${styles.headText} text-center`}>
        Choose your
        <span className="text-siteViolet"> Battle </span>
        Ground
      </h1>

      <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
        {battlegrounds.map((ground) => (
          <div
            key={ground.id}
            className={`${styles.flexCenter} ${styles.battleGroundCard}`}
            onClick={() => handleBattlegroundChoice(ground)}
          >
            <img
              src={ground.image}
              alt="ground"
              className={styles.battleGroundCardImg}
            />
            <div className="info absolute">
              <p className={styles.battleGroundCardText}>{ground.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Battleground;
