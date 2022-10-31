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
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();

  AddNewEvent(NewPlayerEventFilter, provider, (parsedLog) => {
    const { args } = parsedLogs;
    console.log('New player created!', args)

    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: 'success',
        message: 'Player has been successfully registered.'
      })
    }
  })
}