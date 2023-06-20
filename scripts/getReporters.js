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
//npx hardhat run scripts/getReporters.js --network mainnet

const oracleAddress = "0xD9157453E2668B2fc45b7A803D3FEF3642430cC0" // all networks

async function getReporterList(node2) {
    const newestBlock = await web3.eth.getBlockNumber();
    console.log(newestBlock);
    Snap = new Weights(oracleAddress, newestBlock, web3, node2);
    let list = await Snap.getReporters(newestBlock);
    console.log("blockNumber", newestBlock);
    console.log("reporter stats", list);
}

getReporterList(process.env.NODE_URL_MATIC)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

    
