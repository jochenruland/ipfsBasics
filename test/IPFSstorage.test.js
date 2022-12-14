const assert = require('assert');
const path = require('path');
const fs = require('fs');

const { Buffer } = require('buffer');

/**
  * @dev current version of ipfs-http-client is ESM only
  * @dev const ipfsClient = require('ipfs-http-client'); // only works with version 33.1.1
  * const client = new ipfsClient({
  *    host: 'ipfs.infura.io',
  *    port: 5001,
  *    protocol: 'https',
  *    headers: {
  *        authorization: auth,
  *    },
  * });
  */

const apiKeys = require('../API_KEYS.json');
const projectId = apiKeys.projectId;
const projectSecret = apiKeys.projectSecret;
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

async function loadIPFSclient() {
  const { create } = await import('ipfs-http-client')

  const node = await create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
      }
  })

  return node;
}

//console.log(client); //.getEndpointConfig()


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


let dataURL;
let metadataURL;
let client;

before(async () => {
  accounts = await web3.eth.getAccounts();
  contractInstance = new web3.eth.Contract(IPFSstorageJSON.abi, IPFSstorageJSON.networks[deploymentKey].address);

  // Web3 transaction information, we'll use this for every transaction we'll send as long as we do not pass any value
  sendParamaters = {
    from: accounts[0],
    gasLimit: web3.utils.toHex(5000000),
    gasPrice: web3.utils.toHex(20000000000)
  };

  client = await loadIPFSclient();

})

describe('Testing IPFSstorage on mainfork', () => {

  it('1. Contract available on mainfork', () => {
    console.log('Mainfork connected: ', accounts);
    console.log('1. Contract address: ', contractInstance.options.address);
    assert.ok(contractInstance.options.address);
  });

  it('2. Uploads data file to IPFS', async () => {

    console.log("opening an existing file");

    const filePath = path.resolve(__dirname, '../data/', '0.png');
    console.log(filePath);

    const file = fs.readFileSync(filePath);

    /* upload image to IPFS */

    try {
      const addImage = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      );
      console.log(addImage);

      dataURL = `https://ipfs.infura.io/ipfs/${addImage.path}`;
      console.log(`URL of ${filePath}`, dataURL);
    } catch (error) {
      console.log(`addImage[0].path value: ${addImage.path}`);
      console.log(`Error uploading file: ${filePath}`, error);
    }

    //assert.ok(addImage.path);

  });


  it('3. Uploads metadata json to IPFS', async () => {
    // create metadata .json file
    const name = "Elefant von Hinten";
    const description = "Elefant von Hinten Collection";


    const metadataFile = JSON.stringify({
      name, description, image: dataURL
    });

    console.log(metadataFile);

    const buf = Buffer.from(metadataFile);

    /* upload .json metadata file to ipfs */

    try {
      const addMetadata = await client.add(buf);
      console.log(addMetadata);
      metadataURL = `https://ipfs.infura.io/ipfs/${addMetadata.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      console.log('Metadata URL', metadataURL);
    } catch (error) {
      console.log('Error uploading metada file: ', error)
    }

    //assert.ok(addMetadata.path);
  });


  it('4. Writes file hash to IPFSstorage smart contract', async () => {
    await contractInstance.methods.setFile(metadataURL).send(sendParamaters);
  });

  it('5. Reads current user file', async () => {
      console.log(accounts[0]);

      try {
        let result = await contractInstance.methods.metadataURLs(accounts[0]).call({from: accounts[0]});
        console.log('MetadataURL registered in smart contract', result);

      } catch(e) {
        console.log("Error in calling metadataURLs mapping: ", e );
      }

  });

});
