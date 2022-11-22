import React, { useEffect, useState } from 'react'
import tos from '../assets/data/tos.txt'
import LoaderScreen from '../pages/LoaderScreen';
import { FaucetAccount } from '../common/constants';
const xrpl = require("xrpl")

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
    const generatedAccount = await generateAndFundFaucetAccount();
    return generatedAccount;
}

const generateAndFundFaucetAccount = async() => {
    const xrplServerURL = "wss://hooks-testnet-v2.xrpl-labs.com";
    const xrplClient = new xrpl.Client(xrplServerURL);
    await xrplClient.connect();
    try{
        // Generating faucet account
        const new_wallet = xrpl.Wallet.generate();

        // Polling happens every 5 seconds
        return new Promise(async(resolve, reject) => {
            await fetch(`https://hooks-testnet-v2.xrpl-labs.com/newcreds?account=${new_wallet.address}`, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async() => {
                const faucetInterval = setInterval(async()=> {
                    try {
                        // Clearing the interval after success
                        clearInterval(faucetInterval);
                    } catch (error) {
                        resolve(FaucetAccount.faucetAccountCreationError);

                        // Clearing the interval after failure to avoid error loop
                        clearInterval(faucetInterval);
                    }
                    
                }, 5000)
            }).then(async()=> {
                const hostClient = new evernode.HostClient(new_wallet.address, new_wallet.seed);
                await hostClient.connect();

                console.log("Requesting beta EVRs...");
            
                await hostClient.xrplAcc.setTrustLine(FaucetAccount.EVR, hostClient.config.evrIssuerAddress, "99999999999999");

                await hostClient.xrplAcc.makePayment(hostClient.config.foundationAddress,
                    evernode.XrplConstants.MIN_XRP_AMOUNT,
                    evernode.XrplConstants.XRP,
                    null,
                    [{ type: 'giftBetaEvr', format: '', data: '' }]);

                // Keep watching our EVR balance.
                let attempts = 0;
                while (attempts >= 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const balance = await hostClient.getEVRBalance();
                    
                    if (balance === '0') {
                        if (++attempts <= 20)
                            continue;
                        throw "EVR funds not received within timeout.";
                    }
                    resolve({
                        address: new_wallet.address,
                        secret: new_wallet.seed,
                        xrp: await xrplClient.getXrpBalance(new_wallet.address),
                        evrBalance: balance,
                    });
                    break;
                }
                }).catch((error) => {
                    console.log('error', error)
                    reject(error)
                })
        });
        
    }
    catch(error){
        console.log(error);
        throw error;
    }
}