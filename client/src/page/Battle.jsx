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
    setErrorMessage,
    player1Ref,
    player2Ref
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
        // console.log("getPlayerInfo error: ", error);
        setErrorMessage(error)
      }
    };

    if (contract && gameData.activeBattle) {
      getPlayerInfo();
    }
  }, [contract, gameData, battleName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameData?.activeBattle) {
        navigate('/')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])


  const makeMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);

    try {
      await contract.attackOrDefendChoice(choice, battleName);

      setShowAlert({
        status: true,
        type: "info",
        message: `Initiating ${choice === 1 ? 'attack' : 'defense'}`,
      });
    } catch (error) {
      setErrorMessage(error)
    }
  }

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleground}`}
    >
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />

      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card card={player2} title={player2?.playerName} playerTwo cardRef={player2Ref} />
        <div className="flex items-center">
          <ActionButton
            imgUrl={attack}
            restStyles="mr-2 hover:border-yellow-400"
            // 1 - attack
            handleClick={() => makeMove(1)}
          />
          <Card
            card={player1}
            title={player1?.playerName}
            cardRef={player1Ref}
            restStyles="mt-3"
          />
          <ActionButton
            imgUrl={defense}
            restStyles="ml-6 hover:border-red-600"
            // 2 - defese
            handleClick={() => makeMove(2)}
          />
        </div>
      </div>

      <PlayerInfo player={player1} playerIcon={player01Icon} />

      <GameInfo />
    </div>
  );
};

export default Battle;
