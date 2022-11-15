import React, { Fragment, useState } from 'react';
import { Button } from '@material-ui/core';
import { useEvernode } from '../../services/Evernode';
import FaucetBox from '../../components/FaucetBox/index'
import Alert from '@material-ui/lab/Alert';

const TestnetFaucet = () =>  {
  const evernode = useEvernode();
  const [faucetBox, setFaucetBox] = useState({});
  const [accountGeneratedFlag, setAccountGeneratedFlag] = useState(false);

  const testnetFaucet = async() => {
    const accountDetails = await evernode.testnetFaucet();
    console.log(accountDetails)
    setFaucetBox(accountDetails);
    setAccountGeneratedFlag(true);
  }
  
  return (
    <Fragment>
      <Button variant="contained" className='mb-4' onClick={() => testnetFaucet()}>Generate an account and process the fund transaction</Button>
      {(Object.keys(faucetBox).length !== 0 && faucetBox.address) ? <FaucetBox faucetBox = {faucetBox}/> : null}
      {(!faucetBox.address && accountGeneratedFlag) ? <Alert severity="warning">Try again!</Alert> : null}
      
    </Fragment>
  );
}

export default TestnetFaucet
