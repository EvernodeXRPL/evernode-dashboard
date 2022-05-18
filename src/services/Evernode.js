import React from 'react'

const evernode = require("evernode-js-client");

const { createContext, useContext } = React;

const EvernodeContext = createContext(null);

export const EvernodeProvider = (props) => {
    const value = {
        getRegistryAddress: props.getRegistryAddress || getRegistryAddress,
        getEnvironment: props.getEnvironment || getEnvironment,
        getConfigs: props.getConfigs || getConfigs,
        getHostInfo: props.getHostInfo || getHostInfo,
        getHosts: props.getHosts || getHosts,
        getLeases: props.getLeases || getLeases,
        getEVRBalance: props.getEVRBalance || getEVRBalance,
        onLedger: props.onLedger || onLedger
    }

    xrplApi.connect();

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
const environment = 'XRPL NFT DevNet'

const xrplApi = new evernode.XrplApi();
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
    await regClient.connect();
    return regClient.config;
}

const getHosts = async () => {
    await regClient.connect();
    return regClient.getHosts();
}

const getHostInfo = async (address) => {
    const client = new evernode.HostClient(address);
    await client.connect();
    return await client.getRegistration();
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

        const ledgerIndex = e.ledger_index;
        const moment = await regClient.getMoment(ledgerIndex);
        callback({
            ledgerIndex: ledgerIndex,
            moment: moment
        })
    });
}