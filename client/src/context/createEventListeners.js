import { ethers } from 'ethers';


import { ABI } from '../contract';

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter); // prevent multiple listeners for same event type

  provider.on(eventFilter, (logs) => {
    const parsedLog = (new ethers.utils.Interface(ABI)).parseLog(logs);
    cb(parsedLog)
  });
}


export const createEventListeners = ({
  contract,
  navigate,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, (parsedLog) => {
    const { args } = parsedLogs;
    console.log('New player created!', args)

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player has been successfully registered.'
      })
    }
  })

  const NewBattleEventFilter = contract.filters.NewBattle();

  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log('New battle created!', args, walletAddress)

    if (walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()) {
      navigate(`/battle/${args.battleName}`);
      setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
    }
  })


}