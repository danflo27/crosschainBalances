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
//npx hardhat run scripts/getAcctsHolding.js --network mainnet

const tokenMainnet = "0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0" // mainnet token address
const blockNumberMainnet = 17430186 // recent mainnet block

async function getAcctsHoldingMainnet(node2) {
    Snap1 = new Snapshot2(tokenMainnet, blockNumberMainnet, web3,node2)
    let accts1 = await Snap1.getAccountList(blockNumber)
    console.log("Mainnet");
    console.log("blockNumber", blockNumber);
    console.log("myRootHash", accts);
}

getAcctsHoldingMainnet(process.env.NODE_URL)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenPolygon = "0xE3322702BEdaaEd36CdDAb233360B939775ae5f1" // polygon token address
const blockNumberPolygon = 43645358 // recent polygon block

async function getAcctsHoldingPolygon(node2) {
    Snap2 = new Snapshot2(tokenPolygon, blockNumberPolygon, web3,node2)
    let accts2 = await Snap2.getAccountList(blockNumber)
    console.log("Polygon");
    console.log("blockNumber", blockNumber);
    console.log("myRootHash", accts);
}

getAcctsHoldingPolygon(process.env.NODE_URL_MATIC)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenGnosis = "0xaad66432d27737ecf6ed183160adc5ef36ab99f2" // gnosis token address
const blockNumberGnosis = 28338858 // recent gnosis block

async function getAcctsHoldingGnosis(node2) {
    Snap3 = new Snapshot2(tokenGnosis, blockNumberGnosis, web3,node2)
    let accts3 = await Snap3.getAccountList(blockNumber)
    console.log("Gnosis");
    console.log("blockNumber", blockNumber);
    console.log("myRootHash", accts);
}

getAcctsHoldingGnosis(process.env.NODE_URL_GNOSIS)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenOp = "0xaf8cA653Fa2772d58f4368B0a71980e9E3cEB888" // optimism token address
const blockNumberOp = 105281820 // recent optimism block

async function getAcctsHoldingOp(node2) {
    Snap4 = new Snapshot2(tokenOp, blockNumberOp, web3,node2)
    let accts4 = await Snap4.getAccountList(blockNumber)
    console.log("Optimism");
    console.log("blockNumber", blockNumber);
    console.log("myRootHash", accts);
}

getAcctsHoldingOp(process.env.NODE_URL_OPTIMISM)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const tokenArb = "0xd58D345Fd9c82262E087d2D0607624B410D88242" // arbitrum token address
const blockNumberArb = 105281820 // recent arbitrum block

async function getAcctsHoldingArb(node2) {
    Snap5 = new Snapshot2(tokenArb, blockNumberArb, web3,node2)
    let accts5 = await Snap5.getAccountList(blockNumber)
    console.log("Arbitrum");
    console.log("blockNumber", blockNumber);
    console.log("myRootHash", accts);
}

getAcctsHoldingArb(process.env.NODE_URL_ARBITRUM)
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


