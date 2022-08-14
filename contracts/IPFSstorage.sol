// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IPFSstorage {
  mapping(address => string) public metadataURLs;

  function setFile(string memory metadataURL) external {
    files[msg.sender] = metadataURL;
  }
}
