This project is for learning the basics of smart contracts in 2022. 

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

# Deploy our our Smart Contract to our local blockchain.

Test the new functionality we added:
```shell
npx hardhat run scripts/run.js
```

# Update our Smart Contract

We need to do a few things if we update our contract:
1. Deploy it again.
```shell
npx hardhat run scripts/deploy.js --network rinkeby
```
or
```shell
npx hardhat run scripts/deploy.js --network goerli
```
2. Update the contract address on our frontend.
3. Update the abi file on our frontend.
