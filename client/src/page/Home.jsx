import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { CustomButton, CustomInput, PageHOC } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");

  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned...`,
        });
      }
    } catch (error) {
      console.log(error, error.message);
      setShowAlert({
        status: true,
        type: "failure",
        message: "Oops. Something went wrong!",
      });
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress);

      const playerTokenExists = await contract.isPlayerToken(walletAddress);

      if (playerExists && playerTokenExists) {
        navigate("/create-battle");
      }
    };

    if (contract) checkForPlayerToken();
  }, [contract]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton
        title="Register"
        handleClick={handleRegisterClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Vard
    Game
  </>
);
