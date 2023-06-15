require("@nomiclabs/hardhat-waffle")
const Web3 = require('web3')
const web3 = new Web3(hre.network.provider)
const { expect } = require("chai")
const { ethers } = require("hardhat")
const { abi, bytecode } = require("usingtellor/artifacts/contracts/TellorPlayground.sol/TellorPlayground.json")
const h = require("usingtellor/test/helpers/helpers.js")
const assert = require('chai').assert
const MerkleTreeJS = require("../src/MerkleTree")
const MerkleTree = new MerkleTreeJS(Web3)
const Snapshot2 = require("../src/Snapshot2")
const getReporters = require("./getReporters.js")
const getUsers = require("./getReporters.js")
const getTokenHolders = require("./getReporters.js")
require("dotenv").config();

const autoPayAddress = "0x9BE9B0CFA89Ea800556C6efbA67b455D336db1D0";
const oracleAddress = "0xD9157453E2668B2fc45b7A803D3FEF3642430cC0";
const tokenAddress = "0xe3322702bedaaed36cddab233360b939775ae5f1" // polygon
//const tokenAddress = "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0" // mainnet

async function getAllVotes(node2) {
    const newestBlock = await web3.eth.getBlockNumber()
    let Reports = new Snapshot2(oracleAddress, newestBlock, web3, node2);
    let Holders = new Snapshot2(tokenAddress, newestBlock, web3, node2);
    let Users = new Snapshot2(autoPayAddress, newestBlock, web3, node2);
    let reporterList = await Reports.getReporters(newestBlock);
    let holderList = await Holders.getTokenHolders(newestBlock);
    let userList = await Users.getUsers(newestBlock);
    console.log("blockNumber", newestBlock);
    console.log("voting stats", holderList, userList, reporterList);
}


getAllVotes(process.env.NODE_URL_MATIC)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
