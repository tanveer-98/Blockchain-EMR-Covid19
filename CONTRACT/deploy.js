const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/EHR.json");

const provider = new HDWalletProvider(
  'indoor spell onion toe renew hungry bulb glass inspire permit lonely quarter',
  'https://rinkeby.infura.io/v3/bc2d06f969054981a220fd08c9a7f77a'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Deploying contract from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi) //different than before as you dont have to parse the data to json
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "10000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
};

deploy();
