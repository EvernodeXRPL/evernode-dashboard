import React, { useEffect } from 'react';

import {
  Box,
  Tooltip,
  Card,
  CardContent,
  Divider
} from '@material-ui/core';

import Loader from '../../components/Loader';

import { useEvernode } from '../../services/Evernode';

export default function MomentInfo() {
  const [ledger, setLedger] = React.useState(null);
  const [environment, setEnvironment] = React.useState(null);
  const [momentSize, setMomentSize] = React.useState(null);

  const evernode = useEvernode();

  useEffect(() => {
    const listen = async () => {
      await evernode.onLedger((e) => {
        setLedger(e);
      })
    }

    const loadEnvironmet = () => {
      setEnvironment(evernode.getEnvironment());
    }

    const loadMomentSize = async () => {
      const config = await evernode.getConfigs();
      setMomentSize(config.momentSize);
    }

    listen();
    loadEnvironmet();
    loadMomentSize();
  }, [evernode]);

  return (
    <Box className="d-flex align-items m-2 pr-1 pl-1">
      <Card className="card-box">
        {ledger ?
          (
            <CardContent className="p-3">
              <div className="align-box-row align-items-start">
                <div className="font-weight-bold mr-3">
                  <small className="text-black-50 d-block mb-1 text-uppercase">
                    Last closed ledger ({environment})
                  </small>
                  <span className="font-size-l mt-1">{ledger.ledgerIndex}</span>
                </div>
                <Divider orientation="vertical" flexItem />
                <Tooltip title={`1 Moment = ${momentSize} XRPL Ledgers`}>
                  <div className="ml-3">
                    <small className="text-black-50 d-block mb-1 text-uppercase">
                      Moment
                    </small>
                    <span className="font-size-m mt-1">{ledger.moment}</span>
                  </div>
                </Tooltip>
              </div>
            </CardContent>) : <Loader className="p-3" size="1rem" />}
      </Card>
    </Box>
  );
}
