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
