const TypesToBytes = artifacts.require("Seriality/TypesToBytes");
const CmnPkg = artifacts.require("Seriality/CmnPkg");
const RLPDecode = artifacts.require("rlp/RLPDecode");
const RLPEncode = artifacts.require("rlp/RLPEncode");
const BytesToTypes = artifacts.require("rlp/BytesToTypes");
const Memory = artifacts.require("Seriality/Memory");
const SafeMath = artifacts.require("lib/SafeMath");
const BytesLib = artifacts.require("solidity-bytes-utils/contracts/BytesLib");


const BMCValidatorSet = artifacts.require("BMCValidatorSet");


const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));


module.exports = function (deployer, network, accounts) {
    // deploy lib
    deployer.deploy(TypesToBytes).then(function () {
        return deployer.deploy(BytesToTypes);
    }).then(function () {
        return deployer.deploy(Memory);
    }).then(function () {
        return deployer.deploy(SafeMath);
    }).then(function () {
        return deployer.deploy(BytesLib);
    }).then(function () {
        return deployer.deploy(CmnPkg);
    }).then(function () {
        return deployer.deploy(RLPDecode);
    }).then(function () {
        return deployer.deploy(RLPEncode);
    }).then(function () {
        return deployer.deploy(BMCValidatorSet).then(function (validatorInstance) {
            validatorInstance.init();
        });
    });
};
