import React, { useEffect, useState } from 'react'
import tos from '../assets/data/tos.txt'
import LoaderScreen from '../pages/LoaderScreen';

const evernode = require("evernode-js-client");

const { createContext, useContext } = React;

const EvernodeContext = createContext(null);

export const EvernodeProvider = (props) => {
    const [loading, setLoading] = useState(true);

    const value = {
        getRegistryAddress: props.getRegistryAddress || getRegistryAddress,
        getEnvironment: props.getEnvironment || getEnvironment,
        getConfigs: props.getConfigs || getConfigs,
        getTos: props.getTos || getTos,
        getHosts: props.getHosts || getHosts,
        decodeLeaseUri: props.decodeLeaseUri || decodeLeaseUri,
        getLeases: props.getLeases || getLeases,
        getEVRBalance: props.getEVRBalance || getEVRBalance,
        onLedger: props.onLedger || onLedger,
        testnetFaucet: props.testnetFaucet || testnetFaucet,
    }

    const connectXrpl = async () => {
        setLoading(true);
        await xrplApi.connect();
        await regClient.connect();
        setLoading(false);
    };

    useEffect(() => {
        connectXrpl();
    }, []);

    return (
        <EvernodeContext.Provider value={value}>
            {loading ? <LoaderScreen /> : props.children}
        </EvernodeContext.Provider>
    )
}

export const useEvernode = () => {
    return useContext(EvernodeContext)
}

const registryAddress = process.env.REACT_APP_REGISTRY_ADDRESS;
const rippledServer = process.env.REACT_APP_RIPPLED_SERVER;
const environment = 'XRPL Hooks TestNet V2';

const xrplApi = new evernode.XrplApi(rippledServer);
evernode.Defaults.set({
    registryAddress: registryAddress,
    xrplApi: xrplApi
});
const regClient = new evernode.RegistryClient();

const getRegistryAddress = () => {
    return registryAddress;
}

const getEnvironment = () => {
    return environment;
}

const getConfigs = async () => {
    return regClient.config;
}

const getTos = async () => {
    const res = await fetch(tos);
    return await res.text();
}

const getHosts = async (filters = null, pageSize = null, nextPageToken = null) => {
    return regClient.getHosts(filters, pageSize, nextPageToken);
}

const decodeLeaseUri = (uri) => {
    return evernode.UtilHelpers.decodeLeaseNftUri(uri);
}

const getLeases = async (address) => {
    const client = new evernode.HostClient(address);
    await client.connect();

    const nfts = await client.xrplAcc.getNfts();
    const leaseNfts = nfts.filter(n => n.URI.startsWith(evernode.EvernodeConstants.LEASE_NFT_PREFIX_HEX));

    const offers = await client.xrplAcc.getNftOffers();
    let leaseOffers = [];
    for (const offer of offers) {
        const nft = leaseNfts.find(l => l.NFTokenID === offer.NFTokenID);
        if (nft)
            leaseOffers.push({
                nfTokenId: nft.NFTokenID,
                offerIndex: offer.index,
                uri: nft.URI
            });
    }

    return leaseOffers;
}

const getEVRBalance = async (address) => {
    const client = new evernode.HostClient(address);
    await client.connect();

    return await client.getEVRBalance();
}

const onLedger = async (callback) => {
    xrplApi.on(evernode.XrplApiEvents.LEDGER, async (e) => {

        const moment = await regClient.getMoment();
        callback({
            ledgerIndex: e.ledger_index,
            moment: moment
        })
    });
}

const testnetFaucet = async() => {
    const generatedAccount = await generateFaucetAccount();
    return generatedAccount;
}

const generateFaucetAccount = async() => {
    console.log("Generating faucet account...");

    const response = await fetch('https://hooks-testnet-v2.xrpl-labs.com/newcreds', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin":"*", 
            "Access-Control-Allow-Credentials": "true", 
            "Access-Control-Allow-Headers": "content-type", 
            "Access-Control-Max-Age": "1800", 
            "Access-Control-Allow-Methods":"PUT, POST, GET, DELETE, PATCH, OPTIONS"
        }
    });

    const data = await response.json();

    return {
        address: data.address,
        secret: data.secret,
        xrp: data.xrp,
        hash: data.hash,
        code: data.code
    };
}