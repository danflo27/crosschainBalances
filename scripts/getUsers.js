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
//npx hardhat run scripts/getUsers.js --network mainnet

const autopayAddress = "0x9BE9B0CFA89Ea800556C6efbA67b455D336db1D0" // all networks

async function getUserList(node2) {
    const newestBlock = await web3.eth.getBlockNumber()
    console.log(newestBlock);
    Snap = new Weights(autopayAddress, newestBlock, web3, node2)
    let list = await Snap.getUsers(newestBlock)
    console.log("blockNumber", newestBlock);
    console.log("user stats", list);
}

// change to NODE_URL_network
getUserList(process.env.NODE_URL_MATIC)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

    
