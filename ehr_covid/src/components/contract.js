import web3 from './web3';

const address = "0x6c52fE52C3aA695bC41Fb591345323106fFf1E2f";

const ABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "phonenumber",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "trace",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "deceased",
				"type": "bool"
			}
		],
		"name": "UpdateCovidReport",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Viewadmin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "dname",
				"type": "string"
			}
		],
		"name": "addDistrict",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "district",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "phonenumber",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "covidtrace",
				"type": "bool"
			}
		],
		"name": "addPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "district",
				"type": "string"
			}
		],
		"name": "getDistrictActiveCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "district",
				"type": "string"
			}
		],
		"name": "getDistrictDeathCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "phonenumber",
				"type": "uint256"
			}
		],
		"name": "getPatientCovidDetails",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRegisteredPatients",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "register",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
];

export default new web3.eth.Contract(ABI,address);
