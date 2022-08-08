
const options = {
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};


const Web3 = require('web3');
const provider = new Web3.providers.WebsocketProvider('http://127.0.0.1:7545', options);
const web3 = new Web3(provider);

const IPFSstorageJSON = require('../build/contracts/IPFSstorage.json');
const deploymentKey = Object.keys(compJSON.networks)[0];

const daiAbi = require('../scripts/daiAbi.json');
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const daiInstance = new web3.eth.Contract(daiAbi, daiAddress);

const { expectRevert, time } = require('@openzeppelin/test-helpers');
const {sleep} = require('./helpers.js');
const assert = require('assert');

let accounts;
let contractInstance;
let sendParamaters;
let daiOnContractBefore;

const comptroller = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';
const cDai = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643';
const cBat = '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e';
const dai = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const bat = '0x0D8775F648430679A709E98d2b0Cb6250d2887EF';
const priceFeed = '0x6D2299C48a8dD07a872FDd0F8233924872Ad1071';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  contractInstance = new web3.eth.Contract(compJSON.abi, compJSON.networks[deploymentKey].address);

  // Web3 transaction information, we'll use this for every transaction we'll send as long as we do not pass any value
  sendParamaters = {
    from: accounts[0],
    gasLimit: web3.utils.toHex(5000000),
    gasPrice: web3.utils.toHex(20000000000)
  };

})

describe('Testing Comp on mainfork', () => {
  it('1. Contract available on mainfork', () => {
    console.log('Mainfork connected: ', accounts);
    console.log('1. Contract address: ', contractInstance.options.address);
    assert.ok(contractInstance.options.address);
  });

  it('2. Initializes state variables and invests dai and earns interest', async () => {
    await contractInstance.methods.initialize(dai, cDai, bat, cBat, comptroller, priceFeed).send(sendParamaters);

    await daiInstance.methods.transferFrom(accounts[0], contractInstance.options.address, web3.utils.toWei('50', 'ether')).send(sendParamaters);

    daiOnContractBefore = await daiInstance.methods.balanceOf(contractInstance.options.address).call();
    console.log('2a. Dai sent to this contract: ', daiOnContractBefore / 1e18);

    const daiToSupply1 = 10 * 1e18;

    await contractInstance.methods.investDai(web3.utils.toBN(daiToSupply1)).send(sendParamaters);

    const daiOnContractAfter = await daiInstance.methods.balanceOf(contractInstance.options.address).call();
    console.log('2b. Dai available after minting cDai on compound', daiOnContractAfter / 1e18);

    assert(parseInt(daiOnContractBefore) > parseInt(daiOnContractAfter));

  });

  it('3. Redeems cDAi and earns interest', async () => {
    sleep(70000);

    contractInstance.once('LogMyProcess', (error, event) => {
      console.log(event.returnValues);
    });


    await contractInstance.methods.cashOut().send(sendParamaters);
    const daiBalance = await daiInstance.methods.balanceOf(contractInstance.options.address).call();
    console.log('3.  Dai + interests on this contract after redeeming cDai: ' , daiBalance / 1e18);

    assert(parseInt(daiBalance) > parseInt(daiOnContractBefore));
  });

  it('4. Deposits Dai as collateral and borrows Bat token', async () => {
    daiOnContractBefore = await daiInstance.methods.balanceOf(contractInstance.options.address).call();
    console.log('4. Dai on this contract before borrowing bat: ', daiOnContractBefore / 1e18);

    contractInstance.once('LogMyProcess', (error, event) => {
      console.log(event.returnValues);
    });

    await contractInstance.methods.borrow(web3.utils.toWei('10', 'ether')).send(sendParamaters);

  });

  it('5. Repays borrowed amount of Bat token + interest and redeem collateral', async () => {
    // works only in combination with Web3.providers.WebsocketProvider
    contractInstance.events.LogMyProcess()
    .on('data', (event) => {
      console.log(event.returnValues);
    })
    .on('error', console.error);

    await contractInstance.methods.payback().send(sendParamaters);
  });

});





//-----------------------------------------------------------------


const IPFSstorage_test = artifacts.require("IPFSstorage_test");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("IPFSstorage_test", function (/* accounts */) {
  it("should assert true", async function () {
    await IPFSstorage_test.deployed();
    return assert.isTrue(true);
  });
});


import IPFS from "ipfs";

async function initIpfs() {
  node = await IPFS.create();
  const version = await node.version();
  console.log("IPFS Node Version:", version.version);
}

async function readCurrentUserFile() {
  const result = await ipfsContract.userFiles(
    defaultProvider.getSigner().getAddress()
  );

  return result;
}

async function setFile(hash) {
    const ipfsWithSigner = ipfsContract.connect(defaultProvider.getSigner());
    await ipfsWithSigner.setFile(hash);
    setIpfsHash(hash);
}

async function uploadFile(file) {
    const files = [{ path: file.name + file.path, content: file }];

    for await (const result of node.add(files)) {
        await setFile(result.cid.string);
    }
}

**/
