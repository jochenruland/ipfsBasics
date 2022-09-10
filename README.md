# Experimenting with Basic IPFS Features

# To be updated
just some test


## I. Scope
This project provides  an oracle smart contract `./contracts/CMCOracle.sol` which receives data from an external API and a second smart contract `./contracts/RequestOracle.sol` which contains functions to initialize an update and to request data from the oracle smart contract. It further contains two node.js scripts. The first one `./scripts/updataOracle.js`, fetches data from the coinmakretcap API sends it to the oracle contract on request. The second script `./scripts/client.js` represents a user application which initializes the data update of the oracle smart contract by calling the corresponding function in the RequestOracle contract and then requests the data from the latter.  

The main purpose of this application is to create a tutorial teaching the following components of a decentralized application (dApp)

### Learnings:
1. Using Truffle as a development environment for dApps
2. Creating advanced smart contracts introducing the following concepts
  - general concept of an oracle smart contracts
  - fetching data from an external API and updating the oracle
  - requesting an oracle smart contract from another smart contract
  - initializing the data update of an oracle using events
3. Writing node.js scripts using Javascript and the Web3.js library to connect data from external APIs to smart contracts   

## II. Modules and Functions
### 1. Smart Contract CMCOracle.sol
The smart contract contains the main variables and functions to stora and request data from the external coinmakretcap API.

#### i. Constructor
`constructor()`
The constructor does not take any arguments. It defines the owner of the oracle contract as the msg.sender.

#### ii. Public and External Functions
`function initCMCDataUpdate() public`
This function only emits an event `CallbackGetEthCap(1)` which can be handled by the `updateOracle.js` script. This initializes a new API request and update of the data in the oracle contract.

`function feedCMCData(uint _ethPrice) public onlyOwner`
Only the owner of the oracle contract can call this function and update the state variable on the blockchain with newly received information from the coinmakretcap API.

#### iii. Modifiers
`modifier onlyOwner()`
Requires the owner to execute the function marked with this modifier

###2. Smart Contract RequestOracle.sol

###3. Node.js Script updataOracle.js
--> under construction

###3. Node.js Script client.js

## III. Installation
--> under construction
You can deploy your own instance of the tradingbot to any Ethereum testnet or the mainnet. Therefore clone this repo to the preferred directory on your computer using `git...`. Then you have to create your own `.secret` file in the root directory containing the mnemonic of your wallet.

The following dependencies have been installed to run the code:

```
"dependencies": {
  "@openzeppelin/contracts": "^4.4.1",
  "@openzeppelin/test-helpers": "^0.5.15",
  "@truffle/hdwallet-provider": "^2.0.0",
  "@uniswap/v3-periphery": "^1.3.0",
  "mocha": "^9.1.3",
  "web3": "^1.6.1"
}
```
They can be found in `package.json`.






Try using earlier version I have just tried it. Do the following :

npm uninstall --save ipfs-http-client
npm i --save ipfs-http-client@33.1.1
I do not know what the problem is with the updated version but this is a quick fix up for now. And will get your code running
