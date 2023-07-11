const Web3 = require('web3')
const Web3_2 = require('web3')
const ERC20 = require('../artifacts/contracts/helpers/ERC20.sol/ERC20.json')
const ERC20Snapshot = require('../artifacts/contracts/CCBalances.sol/CCBalances.json')
const TellorFlex = require('../artifacts/contracts/TellorFlex.sol/TellorFlex.json')
const Autopay = require('../artifacts/contracts/Autopay.sol/Autopay.json')

//const MerkleTree = require("./MerkleTree")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Weights {

  constructor(address, blockNumber, web3, node2) {
    this.target = address; // contract address
    //console.log(address);
    this.blockNumber = blockNumber; // block number contract was deployed 
    this.web3 = web3;
    this.web2 = web3;
    this.contract2 = new this.web2.eth.Contract(ERC20.abi, this.target);
    this.contract = new this.web3.eth.Contract(ERC20.abi, this.target);
    this.tellorFlexContract = new this.web3.eth.Contract(TellorFlex.abi, this.target);
    this.autopayContract = new this.web3.eth.Contract(Autopay.abi, this.target);
    this.node2 = node2;
    //this.MerkleTree = new MerkleTree(web3);
    this.data = {};
  }

  setSnapshotContract(target) {
    this.snapshot = new this.web3.eth.Contract(ERC20Snapshot.abi, target);
  }

  // Get list of token holders and their percentage of total token supply 
  async getTokenHolders(blockNumber) {
    let accountMap = {};
    let balanceMap = {};
    let y = 0;
    let _shift = 25000
    let _toBlock;
    // scan blocks for transfer event
    while (y < blockNumber) {
      _toBlock = y + _shift
      if (_toBlock > blockNumber) {
        _toBlock = blockNumber
      }
      await this.contract.getPastEvents("Transfer", {
        fromBlock: y,
        toBlock: _toBlock,
      }).then(function (evtData) {
        // make array of addresses that have received tokens
        let index;
        for (index in evtData) {
          let evt = evtData[index];
          accountMap[evt.returnValues.to] = true;
        }
      });
      y += _shift
      console.log("Getting up to block: ", y)
    }

    let key, balance;
    console.log("getting balances..")
    // set provider for all later instances to use
    await this.contract2.setProvider(this.node2);
    // get the token balance of everyone thats received tokens 
    for (key in accountMap) {
      balance = await this.contract2.methods.balanceOf(key).call({}, blockNumber);
      balance = balance / 1e18;
      // make map { address : balance}
      if (balance > 0) {
        //accountList.push(key);
        balanceMap[key] = balance;
      }
    }
    let totalBalance, numberOfHolders, array, top20;
    totalBalance = Object.values(balanceMap).reduce((a, b) => a + b, 0);
    numberOfHolders = Object.keys(balanceMap).length;

    array = Object.entries(balanceMap);
    array = array.sort((a, b) => b[1] - a[1]).slice(0, 20);
    top20 = Object.fromEntries(array);

    for (key in top20) {
      top20[key] = ((top20[key] / totalBalance) * 100).toFixed(3) + "% of token holder vote";
    }
    console.table(top20);
    return { numberOfHolders, totalBalance, array };
  }


  // Gets list of reporters and their percentage of total reports
  async getReporters(blockNumber) {
    let accountMap = {};
    let reportMap = {};
    let y = 0;
    let _shift = 25000
    let _toBlock;
    while (y < blockNumber) {
      _toBlock = y + _shift
      if (_toBlock > blockNumber) {
        _toBlock = blockNumber
      }
      // scan blocks for reports
      await this.tellorFlexContract.getPastEvents("NewReport", {
        fromBlock: y,
        toBlock: _toBlock,
      }).then(function (evtData) {
        // make array of addresses that have reported
        let index;
        for (index in evtData) {
          let evt = evtData[index];
          accountMap[evt.returnValues._reporter] = true;
        }
      });
      y += _shift
      console.log("Getting up to block: ", y)
    }

    let key, reports;
    console.log("getting reports..")
    // set provider for all later instances to use
    await this.tellorFlexContract.setProvider(this.node2);
    for (key in accountMap) {
      // get number of reports by reporter
      reports = await this.tellorFlexContract.methods.getReportsSubmittedByAddress(key).call({}, blockNumber);
      // make map { address : number of reports}
      if (reports > 0) {
        reportMap[key] = Number(reports);
      }
    }
    let totalReports, numberOfReporters, array, top20;
    totalReports = Object.values(reportMap).reduce((a, b) => a + b, 0);
    numberOfReporters = Object.keys(reportMap).length;

    // sort highest to lowest balances
    array = Object.entries(reportMap);
    array = array.sort((a, b) => b[1] - a[1]).slice(0, 20);
    top20 = Object.fromEntries(array);

    for (key in top20) {
      top20[key] = ((top20[key] / totalReports) * 100).toFixed(3) + "% of reporter vote";
    }
    console.table(top20);
    return { numberOfReporters, totalReports, array };
  }

  async getUsers(blockNumber) {
    let accountMap = {};
    let tipMap = {};
    let y = 0;
    let _shift = 25000
    let _toBlock;
    // scan blocks 
    while (y < blockNumber) {
      _toBlock = y + _shift
      if (_toBlock > blockNumber) {
        _toBlock = blockNumber
      }
      // scan blocks for addresses that have added a tip
      await this.autopayContract.getPastEvents("TipAdded", {
        fromBlock: y,
        toBlock: _toBlock,
      }).then(function (evtData) {
        // create array of addresses that have added a tip
        let index;
        for (index in evtData) {
          let evt = evtData[index];
          accountMap[evt.returnValues._tipper] = true;
        }
      });
      // scan blocks for addresses that have funded a data feed
      await this.autopayContract.getPastEvents("DataFeedFunded", {
        fromBlock: y,
        toBlock: _toBlock,
      }).then(function (evtData) {
        // add to array of addresses 
        let index;
        for (index in evtData) {
          let evt = evtData[index];
          accountMap[evt.returnValues._feedFunder] = true;
        }
      });
      y += _shift
      console.log("Getting up to block: ", y)
    }

    let key, tips;
    console.log("getting users..")
    // set provider for all later instances to use
    await this.autopayContract.setProvider(this.node2);
    for (key in accountMap) {
      // get number of tips by user
      tips = await this.autopayContract.methods.getTipsByAddress(key).call({}, blockNumber); // put with get balance ?
      tips = tips / 1e18;
      // make map{ address : number of tips}
      if (tips > 0) {
        tipMap[key] = Number(tips);
      }
    }
    let totalTips, numberOfUsers, array, top20;
    totalTips = Object.values(tipMap).reduce((a, b) => a + b, 0);
    numberOfUsers = Object.keys(tipMap).length;

    array = Object.entries(tipMap);
    array = array.sort((a, b) => b[1] - a[1]).slice(0, 20);
    top20 = Object.fromEntries(array);

    for (key in top20) {
      top20[key] = ((top20[key] / totalTips) * 100).toFixed(3) + "% of user vote";
    }
    console.table(top20);
    return { numberOfUsers, totalTips, array };
  }
/*
  async getAllWeights(blockNumber) {
    let reportAccountMap = [];
    let userAccountMap = [];
    let holderAccountMap = [];
    let balanceMap = {};
    let reportMap = {};
    let userMap = {};
    let y = 0;
    let _shift = 25000
    let _toBlock;
    // scan blocks
    while (y < blockNumber) {
      _toBlock = y + _shift
      if (_toBlock > blockNumber) {
        _toBlock = blockNumber
      }
      // scan for new report event
      await this.tellorFlexContract.getPastEvents("NewReport", {
        fromBlock: y,
        toBlock: _toBlock,
      }).then(function (evtData) {
        // make array of addresses that have reported
        let index;
        for (index in evtData) {
          let evt = evtData[index];
          reportAccountMap[evt.returnValues._reporter] = true;
        }
      });
      // scan for transfer event
      await this.contract.getPastEvents("Transfer", {
        fromBlock: y,
        toBlock: _toBlock,
      }).then(function (evtData) {
        // make array of addresses that have received tokens
        let index;
        for (index in evtData) {
          let evt = evtData[index];
          holderAccountMap.push(evt.returnValues.to);
        }
      });
      y += _shift
      console.log("Getting up to block: ", y)
    }

    let key, balance, tips, reports;
    console.log("getting balances..")
    // set provider for all later instances to use
    await this.contract2.setProvider(this.node2);
    // get the token balance of everyone thats received tokens 
    for (key in holderAccountMap) {
      balance = await this.contract2.methods.balanceOf(key).call({}, blockNumber);
      balance = balance / 1e18;
      // make map { address : balance}
      if (balance > 0) {
        //accountList.push(key);
        balanceMap[key] = balance;
      }
    }
    let totalBalance, numberOfHolders, balanceArray, balanceTop20;
    totalBalance = Object.values(balanceMap).reduce((a, b) => a + b, 0);
    numberOfHolders = Object.keys(balanceMap).length;

    balanceArray = Object.entries(balanceMap);
    balanceArray = balanceArray.sort((a, b) => b[1] - a[1]).slice(0, 20);
    balanceTop20 = Object.fromEntries(balanceArray);

    for (key in balanceTop20) {
      balanceTop20[key] = ((balanceTop20[key] / totalBalance) * 100).toFixed(3) + "% of token holder vote";
    }
    console.table(balanceTop20);

    console.log("getting reports..")
    // set provider for all later instances to use
    await this.tellorFlexContract.setProvider(this.node2);
    for (key in reportAccountMap) {
      // get number of reports by reporter
      reports = await this.tellorFlexContract.methods.getReportsSubmittedByAddress(key).call({}, blockNumber);
      // make map { address : number of reports}
      if (reports > 0) {
        reportMap[key] = Number(reports);
      }
    }
    let totalReports, numberOfReporters, reportArray, reportTop20;
    totalReports = Object.values(reportMap).reduce((a, b) => a + b, 0);
    numberOfReporters = Object.keys(reportMap).length;

    // sort highest to lowest reports
    reportArray = Object.entries(reportMap);
    reportArray = reportArray.sort((a, b) => b[1] - a[1]).slice(0, 20);
    reportTop20 = Object.fromEntries(reportArray);

    for (key in reportTop20) {
      reportTop20[key] = ((reportTop20[key] / totalReports) * 100).toFixed(3) + "% of reporter vote";
    }
    console.table(reportTop20)

    console.log("getting users..")
    await this.autopayContract.setProvider(this.node2);
    for (key in holderAccountMap) {
      // get number of tips by user
      tips = await this.autopayContract.methods.getTipsByAddress(key).call({}, blockNumber);
      // tips = tips / 1e18;
      // make map{ address : number of tips}
      if (tips > 0) {
        tipMap[key] = Number(tips);
      }
    }
    let totalTips, numberOfUsers, userArray, userTop20;
    totalTips = Object.values(tipMap).reduce((a, b) => a + b, 0);
    numberOfUsers = Object.keys(tipMap).length;

    userArray = Object.entries(tipMap);
    userArray = userArray.sort((a, b) => b[1] - a[1]).slice(0, 20);
    userTop20 = Object.fromEntries(userArray);

    for (key in userTop20) {
      userTop20[key] = ((userTop20[key] / totalTips) * 100).toFixed(3) + "% of user vote";
    }
    console.table(userTop20);
  }*/


  /*
    getSortedAccounts(accountList) {
      let sorted = accountList.sort(function (account1, account2) {
        if (account1.toLowerCase() < account2.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      })
      return sorted;
    }
  
    getHashList(sortedAccountList, balanceMap) {
      let hashList = [];
      let key;
      for (key in sortedAccountList) {
        let account = sortedAccountList[key];
        let balance = balanceMap[account];
        let hash = this.MerkleTree.getHash(account, balance);
        hashList.push(hash);
      }
      return hashList;
    }
  
    async getRootHash(blockNumber) {
      await this.setupData(blockNumber)
      return this.data[blockNumber].merkleRoot;
    }
  
    async setupData(blockNumber) {
      if (this.data[blockNumber]) {
        return;
      }
      let accounts = await this.getAccountList(blockNumber);
      let sorted = this.getSortedAccounts(accounts.accountList);
      let hashList = this.getHashList(sorted, accounts.balanceMap);
      let root = this.MerkleTree.getRoot(hashList);
      this.data[blockNumber] = {
        //accountList: accountList,
        sortedAccountList: sorted,
        balanceMap: accounts.balanceMap,
        hashList: hashList,
        merkleRoot: root
      }
    }
  
    async getClaimTX(blockNumber, account) {
      await this.setupData(blockNumber);
      let index;
      let data = this.data[blockNumber];
      for (key in data.sortedAccountList) {
        let acct = data.sortedAccountList[key];
        if (acct == account) {
          index = key;
          break;
        }
      }
      let hashList = this.data[blockNumber].hashList;
      let proof = (this.MerkleTree.createProof(hashList, hashList[index]))
      return proof;
    }*/

}

module.exports = Weights;
