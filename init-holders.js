const web3 = require("web3")
const initHolders = [
  {
    address: "0xcafc839117ad940308817215d1044604e8fba889",
    balance: web3.utils.toBN("21000000000000000000000000000").toString("hex")
  }
];

exports = module.exports = initHolders
