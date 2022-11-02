import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PageHOC, CustomButton } from "../components";
import { useGlobalContext } from "../context";
import styles from "../styles";

const JoinBattle = () => {
  const navigate = useNavigate();
  const { contract, gameData, setShowAlert, setBattleName, walletAddress, setErrorMessage } = useGlobalContext();

  const handleClick = async (battleName) => {
    setBattleName(battleName);

    try {
      await contract.joinBattle(battleName);
      setShowAlert({
        status: true,
        type: "success",
        message: "Joining " + battleName,
      });
    } catch (error) {
      // console.log('Join battle error: ', error)
      setErrorMessage(error)
    }
  }

  return (
    <>
      <h2 className={styles.joinHeadText}>
        Available battles
      </h2>

      <div className={styles.joinContainer}>
        {gameData?.pendingBattles?.length ?
          gameData?.pendingBattles?.filter(battle => !battle.players.includes(walletAddress)).map((battle, idx) => (
            <div key={battle.name + idx} className={styles.flexBetween}>
              <p className={styles.joinBattleTitle}>{idx + 1}. {battle.name}
              </p>
              <CustomButton
                title="Join"
                handleClick={() => handleClick(battle.name)}
              />
            </div>
          ))
          : <p className={styles.joinLoading}>Reload the page to see new battles </p>
        }
      </div>

      <p className={styles.infoText} onClick={() => navigate("/create-battle")}>
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join already existing battle</>
);
