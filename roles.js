const web3 = require("web3")
const RLP = require('rlp');

// Configure
const validators = ["0x3778e4c289f77dc0fda9a6062a5ae9dc7ce69c8a", "0x09e3fd90b1eafa9f5869bf15dfd99edf504075d4", "0x52093c7d03be906c37e0ecb42fd0d9ea1cfb1c0a"];
const owner = "0xcafc839117ad940308817215d1044604e8fba889";

// ===============  Do not edit below ====
function generateExtradata(validators) {
    let extraVanity = Buffer.alloc(32);
    let validatorsBytes = extraDataSerialize(validators);
    let extraSeal = Buffer.alloc(65);
    return Buffer.concat([extraVanity, validatorsBytes, extraSeal]);
}

function extraDataSerialize(validators) {
    let n = validators.length;
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Buffer.from(web3.utils.hexToBytes(validators[i])));
    }
    return Buffer.concat(arr);
}


extraValidatorBytes = generateExtradata(validators);
validatorSetBytes = web3.utils.bytesToHex(RLP.encode(validators));
ownerBytes = web3.utils.bytesToHex(RLP.encode(owner));

exports = module.exports = {
    extraValidatorBytes: extraValidatorBytes,
    validatorSetBytes: validatorSetBytes,
    ownerBytes: ownerBytes,
}