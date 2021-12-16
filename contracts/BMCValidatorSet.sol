pragma solidity 0.6.4;

import "./lib/RLPDecode.sol";

contract BMCValidatorSet {
    using RLPDecode for *;

    uint256 public constant MAX_NUM_OF_VALIDATORS = 41;
    bytes public constant   INIT_VALIDATOR_SET_BYTES = hex"f83f943778e4c289f77dc0fda9a6062a5ae9dc7ce69c8a9409e3fd90b1eafa9f5869bf15dfd99edf504075d49452093c7d03be906c37e0ecb42fd0d9ea1cfb1c0a";
    bytes public constant INIT_OWNER_BYTES = hex"94cafc839117ad940308817215d1044604e8fba889";
    uint32 public constant CODE_OK = 0;
    uint32 public constant ERROR_FAIL_DECODE = 100;


    /*********************** state of the contgetValidatorsract **************************/
    bool public alreadyInit;

    address[] public validators;
    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "msg sender is not the owner");
        _;
    }
    modifier onlyNotInit() {
        require(!alreadyInit, "the contract already init");
        _;
    }

    modifier onlyInit() {
        require(alreadyInit, "the contract not init yet");
        _;
    }
    /*********************** events **************************/
    event validatorSetUpdated(address[] validatorSet);
    /*********************** init **************************/
    function init() external onlyNotInit {
        owner = INIT_OWNER_BYTES.toRLPItem().toAddress();
        require(owner != address(0x0), "failed to init owner");
        address [] memory addrs = decodeValidators();
        for (uint i = 0; i < addrs.length; i++) {
            validators.push(addrs[i]);
        }
        alreadyInit = true;
    }

    function updateValidatorSet(address[] calldata validatorSet) external onlyInit onlyOwner returns (uint32) {
        require(validatorSet.length <= MAX_NUM_OF_VALIDATORS, "the number of validators exceed the limit");
        uint n = validators.length;
        for (uint i = 0; i < n; i++) {
            validators.pop();
        }
        for (uint i = 0; i < validatorSet.length; i++) {
            validators.push(validatorSet[i]);
        }
        emit validatorSetUpdated(validatorSet);
        return CODE_OK;
    }

    function changeOwner(address newOwner) external onlyInit onlyOwner returns (uint32){
        require(newOwner != address(0x0), "failed to change owner");
        owner = newOwner;
        return CODE_OK;
    }

    function getValidators() external view returns (address[] memory) {
        return validators;
    }

    function decodeValidators() internal pure returns (address[] memory) {
        RLPDecode.RLPItem[] memory items = INIT_VALIDATOR_SET_BYTES.toRLPItem().toList();
        address [] memory valAddrs = new address[](items.length);
        for (uint j = 0; j < items.length; j++) {
            valAddrs[j] = items[j].toAddress();
        }
        return valAddrs;
    }
}
