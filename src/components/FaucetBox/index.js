import React from 'react'
import RegularTable from '../../components/RegularTable';
import {
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';
import CopyBox from "../CopyBox";

const FaucetBox = ({faucetBox}) => {
  const tableHeadings = {
    key: 'Key',
    value: 'Value'
  };
  const tableValues = [
    {
      key: 'Address',
      value: <CopyBox copyText={faucetBox.address} iconSize="16"><span className='text-black'>{faucetBox.address}</span></CopyBox>,
    },
    {
      key: 'Secret',
      value: <CopyBox copyText={faucetBox.secret} iconSize="16"><span className='text-black'>{faucetBox.secret}</span></CopyBox>,
    },
    {
      key: 'XRP',
      value: <span className='text-black'>{faucetBox.xrp}</span>,
        
    },
    {
      key: 'EVR',
      value: <span className='text-black'>{faucetBox.evrBalance}</span>,
        
    },
  ];

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card style={{ border: "none", boxShadow: "none" }} className="mb-4 bg-transparent">
            <CardContent className="p-0">
            {(<RegularTable
              headings={tableHeadings}
              values={tableValues}
              highlight={['key']}
              hideHeadings />)}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default FaucetBox