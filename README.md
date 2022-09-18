# Experimenting with Basic IPFS Features

## Scope
The scope of this project is simply to experiment with basic ipfs features using the `ipfs-http-client` and infura.

## Most relevant files
1. `IPFSstorage.sol` -  a basic smart contract to register and request the ipfs path of a file (like you do in an ERC-721 contract)
2. `IPFSstorage.test.js` - test script where files from `./data` folder are uploaded and the smart contract is updated    

## Special remarks
The latest version of `ipfs-http-client` is ESM only. That means you cannot use `require()` to include the module. You have to `import` the module.
There are different possibilities to use ESM with Node.js (cf. blogpost [here](https://blog.logrocket.com/how-to-use-ecmascript-modules-with-node-js/)),
but that implies changing the JavaScript testfile  into a `.mjs`. This format is not supported by `truffle test`. Therefore I used an alternative, which
is to import the ipfs-http-client at runtime using `import()` in an asynchronous function -> cf. `async function loadIPFSclient()` .
Using that function, the mocha standard configuration might run into timeout. I increased the timeout parameter in `truffle-config.js`.

Another alternative is to use an older version of the ipfs-http-client installing it with `npm i --save ipfs-http-client@33.1.1`. This older version
can be included using `require()`. But the corresponding functions of that older module might work slightly different from time to time then described in the
latest docs. For example the `.add()` function will not return an Object but an array including the object. So you have to address the first element of
the array to access the object. I did an implementation with the older version fist, so you can find it checking the pull requests.

## License
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
