import React, { Fragment, useState } from 'react';
import { Button } from '@material-ui/core';
import { useEvernode } from '../../services/Evernode';
import FaucetBox from '../../components/FaucetBox/index'
import Loader from '../../components/Loader';

const TestnetFaucet = () =>  {
  const evernode = useEvernode();
  const [faucetBox, setFaucetBox] = useState({});
  const [accountGeneratedFlag, setAccountGeneratedFlag] = useState(false);
  const [accountButtonClick, setAccountButtonClick] = useState(false);

  const testnetFaucet = async() => {
    setAccountButtonClick(true)
    setAccountGeneratedFlag(false);
    let accountDetails = await evernode.testnetFaucet();
    setFaucetBox(accountDetails);
    if(accountDetails){
      setAccountGeneratedFlag(true);
      setAccountButtonClick(false);
    }
  }
  
  return (
    <Fragment>
      <Button variant="contained" className='mb-4' disabled = {accountButtonClick} onClick={() => testnetFaucet()}>Generate an account and process the fund transaction</Button>
      {(accountButtonClick) ? <Loader className="p-4" /> : null}
      {(accountGeneratedFlag) ? <FaucetBox faucetBox = {faucetBox}/> : null}
    </Fragment>
  );
}

export default TestnetFaucet
