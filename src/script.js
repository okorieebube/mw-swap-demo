
import { REACT_APP_STAKING_CONTRACT_ADDRESS, REACT_APP_TOKEN_CONTRACT_ADDRESS, REACT_APP_PROVIDER, REACT_APP_WICRYPT_DEVICE_CONTRACT_ADDRESS } from './helpers/config.json'
import { Request } from './helpers/https';
const Web3 = require('web3');
const { BigNumber } = require("@ethersproject/bignumber");
const dotenv = require('dotenv')
dotenv.config()



const SWAP_ROUTER_ADDRESS_BSC = '0xe41f0FF3f4d90Bb1c4e32714532e064F9eA95F19';
const BSC_CHAIN_ID = 56;


const SWAP_ROUTER_ADDRESS_MATIC = '0x2F34767898CbCb2cd24F86AC4E61C785D49B2df7';
const MATIC_CHAIN_ID = 137;



export async function connectToBrowserProvider() {
    const { ethereum } = window;
    if (ethereum) {
        if (ethereum) {
            window.web3 = new Web3(ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }

        await confirmUserNetwork()

        let address = await getAddress()
        console.log({ address })
        return address;

    } else {
        console.log("Please install a browser wallet...");
    }
}
export async function loadProvider() {
    const { ethereum } = window;
    if (!ethereum) {
        console.log("Please install a browser wallet...");
        return;
    }
    if (ethereum) {
        window.web3 = new Web3(ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    return window.web3
}
async function confirmUserNetwork() {
    const { ethereum } = window;

    if (!ethereum) {
        console.error("Browser is not Web3 enabled. Install MetaMask!");
        return;
    }
    let userChainId = await ethereum.request({ method: "eth_chainId" });
    console.log("User is connected to chain " + userChainId);

    // String, hex code of the chainId of the  network
    let ChainId = process.env.REACT_APP_CHAIN_ID || '0x38';
    let networkName = process.env.REACT_APP_NETWORK_NAME || "BSC";

    if (userChainId !== ChainId) {
        console.error("You are not connected to the " + networkName + " Network!");
        return;
    } else {
        console.log("Connected to " + networkName + " Network")
    }

}

const getAddress = async () => {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
};

export async function swap(destinationToken, sourceToken, sourceAmount, address) {
    let _sourceAmount = BigNumber.from((sourceAmount * 10 ** 18)
        .toLocaleString('fullwide', { useGrouping: false }));
    let url = `https://stake.xend.tools/networks/${MATIC_CHAIN_ID}/trades?destinationToken=${destinationToken}&sourceToken=${sourceToken}&sourceAmount=${_sourceAmount}&slippage=3&timeout=10000&walletAddress=${address}`;

    let result = await Request.get(url)
    if (result.data) {
        let swapData = result.data;
        let tradeData = swapData[0].trade.data;

        let client = await loadProvider()
        let txn = await client.eth.sendTransaction({
            from: address,
            to: SWAP_ROUTER_ADDRESS_MATIC,
            data: tradeData,
            value: _sourceAmount,
            gas: 300000,   //   300000 GAS
            gasPrice: 500000000000  //  wei
        })

        console.log({ txn })
    }
}




