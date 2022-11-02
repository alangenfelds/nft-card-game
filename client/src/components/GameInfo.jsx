import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CustomButton } from "../components";
import { useGlobalContext } from "../context";
import { alertIcon, gameRules } from "../assets";
import styles from "../styles";

const GameInfo = () => {
  const { contract, gameData, setShowAlert } = useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const navigate = useNavigate();

  const handleBattleExit = async () => {};

  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <img src={alertIcon} alt="info" className={styles.gameInfoIconImg} />
        </div>
      </div>

      {/* SIDEBAR */}

      <div
        className={`${styles.gameInfoSidebar} ${styles.glassEffect} ${
          styles.flexBetween
        } backdrop-blur-3xl ${
          toggleSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose} `}
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>

          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>

          <div className="mt-3">
            {gameRules.map((rule, idx) => (
              <p key={`game-rule-index-${idx}`} className={styles.gameInfoText}>
                <span className="font-bold">{idx + 1}</span>. {rule}
              </p>
            ))}
          </div>

          <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
            <CustomButton
              title="Change Battleground"
              handleClick={() => navigate("/battleground")}
            />
            <CustomButton
              title="Exit Battle"
              handleClick={() => handleBattleExit()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameInfo;
