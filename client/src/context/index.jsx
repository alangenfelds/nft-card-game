import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";

import { ABI, ADDRESS } from "../contract";
import { createEventListeners } from "./createEventListeners";
import { GetParams } from "../utils/onboard";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const [battleName, setBattleName] = useState("");
  const [gameData, setGameData] = useState({
    players: [], pendingBattles: [], activeBattle: null
  });
  const [updateGameData, setUpdateGameData] = useState()
  const [battleground, setBattleground] = useState('bg-astral');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('')
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });

  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const battlegroundFromLocalStorage = localStorage.getItem('battleground');

    if (battlegroundFromLocalStorage) {
      setBattleground(battlegroundFromLocalStorage)
    } else {
      localStorage.setItem('battleground', battleground)
    }
  }, [])

  // Reset web3 onboarding modal params
  useEffect(() => {
    const resetParams = async () => {
      const currentStep = GetParams();
      setStep(currentStep.step)
    }

    resetParams();

    window?.ethereum?.on('chainChanged', () => resetParams())
    window?.ethereum?.on('accountsChanged', () => resetParams())
  }, [])


  // Set the wallet address
  const updateCurrentWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts) {
      setWalletAddress(accounts[0]);
    }
  };

  useEffect(() => {
    updateCurrentWalletAddress();

    window.ethereum.on("accountsChanged", updateCurrentWalletAddress);
  }, []);

  // Set the smart contract and the provider to the state
  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(newProvider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (contract && step !== -1) {
      createEventListeners({
        contract,
        navigate,
        provider,
        walletAddress,
        setShowAlert,
        setUpdateGameData,
        player1Ref,
        player2Ref
      });
    }
  }, [contract, step]);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({
          status: false,
          type: "info",
          message: "",
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Handle error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason?.slice('execution reverted: '.length)?.slice(0, -1)

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage])


  // Set the game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      const fethedBattles = await contract.getAllBattles();

      // battleStatus: 0 means PENDING battle
      const pendingBattles = fethedBattles.filter(battle => battle.battleStatus === 0);

      let activeBattle = null;

      fethedBattles.forEach(battle => {
        if (battle.players.find(player => player.toLowerCase() === walletAddress.toLowerCase())) {
          if (battle.winner.startsWith('0x00')) {
            activeBattle = battle;
          }
        }
      });

      setGameData({
        // need to start from 1 as pendingBattles[0] is always empty
        pendingBattles: pendingBattles.slice(1),
        activeBattle
      })

      // console.log({ fethedBattles })
    }

    if (contract) fetchGameData();
  }, [contract, updateGameData])

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        battleName,
        gameData,
        setBattleName,
        setShowAlert,
        battleground,
        setBattleground,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
