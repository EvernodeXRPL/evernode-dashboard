import React, { Fragment, useState } from 'react';
import { Button } from '@material-ui/core';
import { useEvernode } from '../../services/Evernode';
import FaucetBox from '../../components/FaucetBox/index'
import Loader from '../../components/Loader';
import Alert from '@material-ui/lab/Alert';

const TestnetFaucet = () =>  {
  const evernode = useEvernode();
  const [faucetBox, setFaucetBox] = useState({});
  const [accountGeneratedFlag, setAccountGeneratedFlag] = useState(false);
  const [accountButtonClick, setAccountButtonClick] = useState(false);
  const [warningDisplay, setWarningDisplay] = useState(false);

  const testnetFaucet = async() => {
    setAccountButtonClick(true)
    setAccountGeneratedFlag(false); 
    let accountDetails = await evernode.testnetFaucet();
    
      if(accountDetails.toString() === "ERR_IN_FAUCET_GEN"){
        setWarningDisplay(true);
        setAccountButtonClick(false);
      }
      else{
        setWarningDisplay(false);
        setFaucetBox(accountDetails);
        if(accountDetails !== undefined && typeof accountDetails !== 'undefined'){
          setAccountGeneratedFlag(true);
          setAccountButtonClick(false);
      }
    }
  }
  
  return (
    <Fragment>
      <Button variant="contained" className='mb-4' disabled = {accountButtonClick} onClick={() => testnetFaucet()}>Generate an account and process the fund transaction</Button>      
      {(accountButtonClick) ? <Loader className="p-4" /> : null}
      {(accountGeneratedFlag) ? <FaucetBox faucetBox = {faucetBox}/> : null}
      {warningDisplay && <Alert severity="warning">Try again shortly!</Alert>}
    </Fragment>
  );
}

export default TestnetFaucet
