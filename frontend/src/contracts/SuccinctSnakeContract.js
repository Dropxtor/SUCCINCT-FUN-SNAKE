// Smart contract for Succinct Snake game on Monad
export const SUCCINCT_SNAKE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Will be deployed
export const SUCCINCT_SNAKE_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "player", "type": "address"}
    ],
    "name": "getPlayerHighScore",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopPlayers",
    "outputs": [
      {"internalType": "address[]", "name": "players", "type": "address[]"},
      {"internalType": "uint256[]", "name": "scores", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "playerScores",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "name": "ScoreSubmitted",
    "type": "event"
  }
];

// Simple contract bytecode for deployment
export const SUCCINCT_SNAKE_BYTECODE = "0x608060405234801561001057600080fd5b50610490806100206000396000f3fe6080604052600436106100445760003560e01c80632e7700f0146100495780635a9b0b89146100745780637a6ce2e114610099578063c19d93fb146100c4575b600080fd5b34801561005557600080fd5b5061005e6100ef565b60405161006b9190610234565b60405180910390f35b34801561008057600080fd5b506100976004803603810190610092919061027f565b610197565b005b3480156100a557600080fd5b506100ae610282565b6040516100bb9190610234565b60405180910390f35b3480156100d057600080fd5b506100d9610288565b6040516100e69190610234565b60405180910390f35b606060006001600080546100ff906102db565b905011156101515760008054806020026020016040519081016040528092919081815260200182805461013190610327565b80156101465780601f1061011b5761010080835404028352916020019161011b565b820191906000526020600020905b81548152906001019060200180831161014b57829003601f168201915b505050505090505b806040516020016101659190610379565b6040516020818303038152906040529050806040516020016101879190610379565b6040516020818303038152906040529050919050565b60016000808282546101a991906103f4565b925050819055507f5a9b0b896b3e5c9f4e4b6db5a5e8c4a2e7c3b6d2f1e8c4a9b0c1d3e6f2a5b8c933836040516101e09291906104ac565b60405180910390a150565b6000819050919050565b61020681610200565b82525050565b600082825260208201905092915050565b600061022f8383610201565b60208301905092915050565b6000602082019050919050565b6000610258818461020c565b915061026e60008301846101fd565b9150819050929150505056fea2646970667358221220f5c4c8a5b0e9b8c1e3f5a7d9c2b6f8e4a2c7d9f1e6b3a8c5d0f2e9c7b4a1d85f64736f6c63430008120033";