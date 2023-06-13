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
require("dotenv").config();
//npx hardhat run scripts/getUsers.js --network mainnet

const autoPayAddress = "0x9BE9B0CFA89Ea800556C6efbA67b455D336db1D0"

async function getUserList(node2) {
    const newestBlock = await web3.eth.getBlockNumber()
    Snap = new Snapshot2(autoPayAddress, newestBlock, web3, node2)
    let list = await Snap.getUsers(newestBlock)
    console.log("blockNumber", newestBlock);
    console.log("user stats", list);
}


getUserList(process.env.NODE_URL_MATIC)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

    
