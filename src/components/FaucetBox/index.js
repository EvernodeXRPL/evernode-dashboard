import React from 'react'
import Loader from '../../components/Loader';
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
      key: 'TX',
      value: <span className='text-black'>{faucetBox.hash}</span>,
        
    },
    {
      key: 'XRP',
      value: <span className='text-black'>{faucetBox.xrp}</span>,
        
    },
    {
      key: 'Result',
      value: <span className='text-black'>{faucetBox.code}</span>,
        
    }
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
              hideHeadings />) ||
              <Loader className="p-4" />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default FaucetBox