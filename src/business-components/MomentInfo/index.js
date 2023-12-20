import React, { useEffect } from 'react';

import {
  Box,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Grid
} from '@material-ui/core';

import Loader from '../../components/Loader';

import { useEvernode } from '../../services/Evernode';

export default function MomentInfo() {
  const evernode = useEvernode();
  const environment = evernode.environment[0];
  const [ledger, setLedger] = React.useState(null);
  const [config, setConfig] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configData = await evernode.getConfigs();
        setConfig(configData);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    const listen = async () => {
      await evernode.onLedger((e) => {
        setLedger(e);
      });
      await fetchData();
    };

    listen();
  }, [evernode]);

  return (
    <Box className="d-flex align-items m-2 pr-1 pl-1">
      <Card className="card-box">
        {ledger ?
          (
            <CardContent className="p-3">
              <div className="align-box-row align-items-start">
                <div className="font-weight-bold mr-3 pr-1">
                  <Grid container>
                    <Grid item xs={9} sm={12}>
                      <small className="text-black-50 d-block mb-1 text-uppercase">
                        Last closed ledger ({environment})
                      </small>
                    </Grid>
                    <Grid item xs={3} sm={12}>
                      <span className="font-size-l mt-1">{ledger.ledgerIndex}</span>
                    </Grid>
                  </Grid>
                </div>
                <Divider orientation="vertical" flexItem />
                <Tooltip title={`1 Moment = ${config.momentSize} ${config.momentBaseInfo.momentType === 'ledger' ? 'Xahau Ledgers' : 'Seconds'}`}>
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
