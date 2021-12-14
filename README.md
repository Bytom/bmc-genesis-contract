# bmc-genesis-contracts


## Prepare

Install dependency:
```shell script
npm install
``` 

## unit test

Generate contracts for testing:
```shell script
# the first account of ganache
node generate-validatorset.js --mock true
```

Start ganache:
```shell script
ganache-cli --mnemonic 'clock radar mass judge dismiss just intact mind resemble fringe diary casino' --gasLimit 13000000  -e 10000
```

Run truffle test:
```shell script
truffle compile
truffle migrate
truffle test
```

Flatten all system contracts:
```shell script
npm run flatten
```

## how to generate genesis file.
 
1. Edit `init-holders.js` file to alloc the initial token holder.
2. Edit `roles.js` file to alloc the initial validator set and owner.
3. Edit `generate-validatorset.js` file to change `fromChainId` and `toChainId`,
6. run ` node generate-genesis.js` will generate genesis.json
## License

The library is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0),
also included in our repository in the [LICENSE](LICENSE) file.
