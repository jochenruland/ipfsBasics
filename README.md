# Experimenting with Basic IPFS Features

## Scope
The scope of this project is simply to experiment with basic ipfs features using the ipfs http client and infura.

## Most relevant files
1. `IPFSstorage.sol` -  a basic smart contract to register and request ipfs path (like you do in ERC-721)
2. `IPFSstorage.test.js` - test script where files from `./data` folder are uploaded and the smart contract is updated    

## Special remarks
latest version of `ipfs-http-client` did not work using `require()` - therefore I used `npm i --save ipfs-http-client@33.1.1`

##License
MIT License

Copyright (c) 2022 JochenRuland

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
