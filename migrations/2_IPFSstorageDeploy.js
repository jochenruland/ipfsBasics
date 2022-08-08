const IPFSstorage = artifacts.require("IPFSstorage");

module.exports = function (deployer) {
  deployer.deploy(IPFSstorage);
};
