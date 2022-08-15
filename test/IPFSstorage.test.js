const assert = require('assert');

import { create as ipfsHttpClient } from 'ipfs-http-client';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

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

let accounts;
let contractInstance;
let sendParamaters;

before(async () => {
  accounts = await web3.eth.getAccounts();
  contractInstance = new web3.eth.Contract(IPFSstorageJSON.abi, IPFSstorageJSON.networks[deploymentKey].address);

  // Web3 transaction information, we'll use this for every transaction we'll send as long as we do not pass any value
  sendParamaters = {
    from: accounts[0],
    gasLimit: web3.utils.toHex(5000000),
    gasPrice: web3.utils.toHex(20000000000)
  };

})

let dataURL;
let metadataURL;

describe('Testing IPFSstorage on mainfork', () => {
  it('1. Contract available on mainfork', () => {
    console.log('Mainfork connected: ', accounts);
    console.log('1. Contract address: ', contractInstance.options.address);
    assert.ok(contractInstance.options.address);
  });

  it('2. Uploads data file to IPFS', async () => {
    /* upload image to IPFS */
    const dataFile = '../data/0.png';

    try {
      const added = await client.add(
        dataFile,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      dataURL = `https://ipfs.infura.io/ipfs/${added.path}`;
      console.log('DataFile .png URL', dataURL);
    } catch (error) {
      console.log('Error uploading .png file: ', error);
    }

    assert.ok(added.path);
  });

  it('3. Uploads metadata json to IPFS', async () => {

    /**
     * @dev - fetch metadata from input and create .json file
     * const { name, description, price } = formInput

     * if (!name || !description || !price || !fileUrl) return
     */

    const name = "Elefant von Hinten";
    const description = "Elefant von Hinten Collection";


    metadataFile = JSON.stringify({
      name, description, image: dataURL
    });

    console.log(metadataFile);

    /* upload .json metadata file to ipfs */

    try {
      const added = await client.add(metadataFile);
      metadataURL = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log('Metadata URL', metadataURL);
    } catch (error) {
      console.log('Error uploading metada file: ', error)
    }

    assert.ok(added.path);
  });


  it('4. Writes file hash to IPFSstorage smart contract', async () => {
    await contractInstance.methods.setFile(metadataURL).send(sendParamaters);
  });

  it('5. Reads current user file', async () => {
      const result = await contractInstance.methods.metadataURLs(accounts[0]).call();

      console.log('MetadataURL registered in smart contract', result);
  });

});





//-----------------------------------------------------------------
