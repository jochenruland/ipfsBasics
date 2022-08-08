
import IPFS from "ipfs";

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
const deploymentKey = Object.keys(IPFSstorageJSON.networks)[0];

const assert = require('assert');

let accounts;
let contractInstance;
let sendParamaters;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  contractInstance = new web3.eth.Contract(IPFSstorageJSON.abi, IPFSstorageJSON.networks[deploymentKey].address);

  // Web3 transaction information, we'll use this for every transaction we'll send as long as we do not pass any value
  sendParamaters = {
    from: accounts[0],
    gasLimit: web3.utils.toHex(5000000),
    gasPrice: web3.utils.toHex(20000000000)
  };

})

describe('Testing IPFSstorage on mainfork', () => {
  it('1. Contract available on mainfork', () => {
    console.log('Mainfork connected: ', accounts);
    console.log('1. Contract address: ', contractInstance.options.address);
    assert.ok(contractInstance.options.address);
  });

  it('2. initializes a IPFS node', async () => {
    node = await IPFS.create();
    const version = await node.version();
    console.log("IPFS Node Version:", version.version);
    assert.ok(version.version);
  });

  it('3. Uploads file to IPFS', async (file) => {
    const files = [{ path: file.name + file.path, content: file }];

    for await (const result of node.add(files)) {
      await setFile(result.cid.string);
      }
    }

    console.log('...');

    assert(parseInt(daiBalance) > parseInt(daiOnContractBefore));
  });

  it('4. Writes file hash to IPFSstorage smart contract', async (hash) => {
    const ipfsWithSigner = ipfsContract.connect(defaultProvider.getSigner());
    await ipfsWithSigner.setFile(hash);
    setIpfsHash(hash);
  });

  it('5. Reads current user file', async () => {
      const result = await ipfsContract.userFiles(defaultProvider.getSigner().getAddress());

      return result;
  });

});





//-----------------------------------------------------------------
