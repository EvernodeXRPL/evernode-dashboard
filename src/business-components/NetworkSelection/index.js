import React from 'react';
import {
  Select,
  MenuItem,
  FormControl
} from '@material-ui/core';
import { useEvernode } from '../../services/Evernode';


export default function NetworkSelection() {
  const evernode = useEvernode();
  const [network, setNetwork] = evernode.environment;

  const handleChange = async (event) => {
    setNetwork(event.target.value);
  };

  return (
    <FormControl style={{ backgroundColor: "white", padding: "10px", borderRadius: "15px" }}>
      <Select
        disableUnderline
        labelId="network-selection"
        id="network-selection"
        value={network}
        onChange={handleChange}
      >
        <MenuItem value={'mainnet'}>Mainnet</MenuItem>
        <MenuItem value={'devnet'}>Devnet</MenuItem>
        <MenuItem value={'testnet'}>Testnet</MenuItem>
      </Select>
    </FormControl>
  );
}
