import React from 'react'

const evernode = require("evernode-js-client");

const { createContext, useContext } = React;

const EvernodeContext = createContext(null);

export const EvernodeProvider = (props) => {
    const value = {
        registryAddress: props.registryAddress || registryAddress,
        defHostAddress: props.defHostAddress || defHostAddress,
        getHostInfo: props.getHostInfo || getHostInfo,
        getConfigs: props.getConfigs || getConfigs,
        getLeases: props.getLeases || getLeases,
        getEVRBalance: props.getEVRBalance || getEVRBalance
    }

    return (
        <EvernodeContext.Provider value={value}>
            {props.children}
        </EvernodeContext.Provider>
    )
}

export const useEvernode = () => {
    return useContext(EvernodeContext)
}

const registryAddress = process.env.REACT_APP_REGISTRY_ADDRESS;
const defHostAddress = process.env.REACT_APP_DEF_HOST_ADDRESS;

const xrplApi = new evernode.XrplApi();
evernode.Defaults.set({
    registryAddress: registryAddress,
    xrplApi: xrplApi
});

const getHostInfo = async (address) => {
    await xrplApi.connect();
    const client = new evernode.HostClient(address);
    await client.connect();
    return await client.getRegistration();
}

const getConfigs = async () => {
    await xrplApi.connect();
    const client = new evernode.RegistryClient();
    await client.connect();
    return client.config;
}

const getLeases = async (address = defHostAddress) => {
    await xrplApi.connect();
    const client = new evernode.HostClient(address);
    await client.connect();

    const nfts = await client.xrplAcc.getNfts();
    const leaseNfts = nfts.filter(n => n.URI.startsWith(evernode.EvernodeConstants.LEASE_NFT_PREFIX_HEX));

    const offers = await client.xrplAcc.getNftOffers();
    const leaseOffers = offers.filter(o => leaseNfts.map(l => l.NFTokenID).includes(o.NFTokenID));

    return leaseOffers;
}

const getEVRBalance = async (address = defHostAddress) => {
    await xrplApi.connect();
    const client = new evernode.HostClient(address);
    await client.connect();

    return await client.getEVRBalance();
}