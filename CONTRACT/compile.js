const path = require('path');

const solc = require('solc');
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

const helloPath = path.resolve(__dirname, 'contracts', 'CovidEHR.sol');
const source = fs.readFileSync(helloPath, 'UTF-8');

var input = {
    language: 'Solidity',
    sources: {
        'CovidEHR.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));

console.log(output)
// const exportPath = path.resolve(__dirname,'Compiled');
//
// for (let contract in output.contracts["CovidEHR.sol"]) {
//   fileSystem.outputJSONSync(
//     path.resolve(exportPath, "CovidEHR_abi.json"),
//     output.contracts["CovidEHR.sol"][contract].abi
//   );
//
//   fileSystem.outputJSONSync(
//     path.resolve(exportPath, "CovidEHR_Bytecode.json"),
//     output.contracts["CovidEHR.sol"][contract].evm.bytecode.object
//   );
// }const buildPath = path.resolve(__dirname, "build");
//
if (output.errors) {
  output.errors.forEach(err => {
    console.log(err.formattedMessage);
  });
} else {
  const contracts = output.contracts["CovidEHR.sol"];
  fs.ensureDirSync(buildPath);
  for (let contractName in contracts) {
    const contract = contracts[contractName];
    fs.writeFileSync(
      path.resolve(buildPath, `${contractName}.json`),
      JSON.stringify(contract, null, 2),
      "utf8"
    );
  }
}
