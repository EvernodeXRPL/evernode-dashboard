import React, { Fragment, useState } from 'react';
import { Button } from '@mui/material';
import { useEvernode } from '../../services/Evernode';
import FaucetBox from '../../components/FaucetBox/index'
import Loader from '../../components/Loader';
import Alert from '@mui/material/Alert';

const TestnetFaucet = () => {
  const evernode = useEvernode();
  const [faucetBox, setFaucetBox] = useState({});
  const [accountGeneratedFlag, setAccountGeneratedFlag] = useState(false);
  const [accountButtonClick, setAccountButtonClick] = useState(false);
  const [warningDisplay, setWarningDisplay] = useState(false);

  const testnetFaucet = () => {
    setAccountButtonClick(true)
    setAccountGeneratedFlag(false);
    evernode.testnetFaucet().then(accountDetails => {
      setWarningDisplay(false);
      setFaucetBox(accountDetails);
      if (accountDetails !== undefined && typeof accountDetails !== 'undefined') {
        setAccountGeneratedFlag(true);
        setAccountButtonClick(false);
      }
    }).catch(e => {
      setWarningDisplay(true);
      setAccountButtonClick(false);
    });
  }

  return (
    <Fragment>
      <Button variant="contained" className='mb-4' disabled={accountButtonClick} onClick={() => testnetFaucet()}>Generate an account</Button>
      {(accountButtonClick) ? <Loader className="p-4" /> : null}
      {(accountGeneratedFlag) ? <FaucetBox faucetBox={faucetBox} /> : null}
      {warningDisplay && <Alert severity="warning">Try again shortly!</Alert>}
    </Fragment>
  );
}

export default TestnetFaucet
