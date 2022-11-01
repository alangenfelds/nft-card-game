import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Alert, ActionButton, Card, GameInfo, PlayerInfo } from "../components";
import { useGlobalContext } from "../context";
import {
  attack,
  attackSound,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from "../assets";
import { playAudio } from "../utils/animation";
import styles from "../styles";

const Battle = () => {
  const {
    contract,
    gameData,
    walletAddress,
    showAlert,
    setShowAlert,
    battleground,
  } = useGlobalContext();

  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});

  const { battleName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let player01Address = null;
        let player02Address = null;

        if (
          gameData.activeBattle.players[0].toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.players[0];
          player02Address = gameData.activeBattle.players[1];
        } else {
          player01Address = gameData.activeBattle.players[1];
          player02Address = gameData.activeBattle.players[0];
        }

        const p1TokenData = await contract.getPlayerToken(player01Address);
        const player01 = await contract.getPlayer(player01Address);

        const player02 = await contract.getPlayer(player02Address);

        const p1Attack = p1TokenData.attackStrength.toNumber();
        const p1Defense = p1TokenData.defenseStrength.toNumber();
        const p1Health = player01.playerHealth.toNumber();
        const p1Mana = player01.playerMana.toNumber();
        const p2Health = player02.playerHealth.toNumber();
        const p2Mana = player02.playerMana.toNumber();

        setPlayer1({
          ...player01,
          att: p1Attack,
          def: p1Defense,
          health: p1Health,
          mana: p1Mana,
        });

        setPlayer2({
          ...player02,
          att: "X",
          def: "X",
          health: p2Health,
          mana: p2Mana,
        });
      } catch (error) {
        console.log("getPlayerInfo error: ", error);
      }
    };

    if (contract && gameData.activeBattle) {
      getPlayerInfo();
    }
  }, [contract, gameData, battleName]);

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleground}`}
    >
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />

      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card card={player2} title={player2?.playerName} playerTwo cardRef="" />
        <div className="flex items-center">
          <ActionButton
            imgUrl={attack}
            handleClick={() => {}}
            restStyles="mr-2 hover:border-yellow-400"
          />
          <Card
            card={player1}
            title={player1?.playerName}
            cardRef=""
            restStyles="mt-3"
          />
          <ActionButton
            imgUrl={defense}
            handleClick={() => {}}
            restStyles="ml-6 hover:border-red-600"
          />
        </div>
      </div>

      <PlayerInfo player={player1} playerIcon={player01Icon} mt />

      <GameInfo />
    </div>
  );
};

export default Battle;
