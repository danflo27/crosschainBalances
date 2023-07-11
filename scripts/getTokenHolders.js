require("@nomiclabs/hardhat-waffle")
const Web3 = require('web3')
const web3 = new Web3(hre.network.provider)
const { expect } = require("chai")
const { ethers } = require("hardhat")
const { abi, bytecode } = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json")
const h = require("usingtellor/test/helpers/helpers.js")
const assert = require('chai').assert
const Weights = require("../src/Weights")
require("dotenv").config();
//npx hardhat run scripts/getBalanceMap.js --network mainnet

//const tokenAddress = "0xd58D345Fd9c82262E087d2D0607624B410D88242" // arbitrum
//const tokenAddress = "0xAAd66432d27737ecf6ED183160Adc5eF36aB99f2" //gnosis
//const tokenAddress = "0xe3322702bedaaed36cddab233360b939775ae5f1" // polygon
//const tokenAddress = "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0" // mainnet
const tokenAddress = "0xaf8cA653Fa2772d58f4368B0a71980e9E3cEB888" // optimism


async function getPowerMap(node2) {
    const newestBlock = await web3.eth.getBlockNumber()
    console.log(newestBlock)
    Snap = new Weights(tokenAddress, newestBlock, web3, node2)
    let list = await Snap.getTokenHolders(newestBlock)
    console.log("blockNumber", newestBlock);
    console.log("token holder stats", list);
}


getPowerMap(process.env.NODE_URL_OPTIMISM)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


