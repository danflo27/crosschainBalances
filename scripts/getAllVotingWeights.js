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
const GetReporters = require("./GetReporters.js")
const GetUsers = require("./GetReporters.js")
const GetTokenHolders = require("./GetReporters.js")
require("dotenv").config();

const autoPayAddress = "0x9BE9B0CFA89Ea800556C6efbA67b455D336db1D0";
const oracleAddress = "0xD9157453E2668B2fc45b7A803D3FEF3642430cC0";
const tokenAddress = "0xe3322702bedaaed36cddab233360b939775ae5f1" // polygon
