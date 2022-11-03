import { ethers } from "ethers";
import { defenseSound } from "../assets";

import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation";

const EMPTY_ACCOUNT = "0x0000000000000000000000000000000000000000";

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter); // prevent multiple listeners for same event type

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLog);
  });
};

const getCoords = (cardRef) => {
  const { left, top, width, height } =
    cardRef?.current?.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventListeners = ({
  contract,
  navigate,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, (parsedLog) => {
    const { args } = parsedLogs;
    console.log("New player created!", args);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered.",
      });
    }
  });

  const NewBattleEventFilter = contract.filters.NewBattle();

  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("New battle created!", args, walletAddress);

    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
      setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
    }
  });

  const BattleMoveEventFilter = contract.filters.BattleMove();

  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle move initiated", args);
  });

  const RoundEndedEventFilter = contract.filters.RoundEnded();

  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log("Round Ended", args, walletAddress);
    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== EMPTY_ACCOUNT) {
        // somebody damaged
        if (args.damagedPlayers[i] === walletAddress) {
          // current player is damaged
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          // other player is damaged
          sparcle(getCoords(player2Ref));
        }
      } else {
        // nobody damaged
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleEndedEventFilter = contract.filters.BattleEnded();

  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    console.log("Battle ended!", args, walletAddress);

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "You Won!",
      });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "You Lost!",
      });
    }

    navigate("/create-battle");
  });
};
