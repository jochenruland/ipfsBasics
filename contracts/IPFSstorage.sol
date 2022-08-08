// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IPFSstorage {
  mapping(address => string) public files;

  function setFile(string memory file) external {
    files[msg.sender] = file;
  }
}
