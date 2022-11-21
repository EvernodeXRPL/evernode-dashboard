import React from 'react'
import RegularTable from '../../components/RegularTable';
import {
  Grid,
  Card,
  CardContent,
} from '@material-ui/core';

const FaucetBox = ({faucetBox}) => {
  const tableHeadings = {
    key: 'Key',
    value: 'Value'
  };
  const tableValues = [
    {
      key: 'Address',
      value: <span className='text-black'>{faucetBox.address}</span>,
    },
    {
      key: 'Secret',
      value: <span className='text-black'>{faucetBox.secret}</span>,
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