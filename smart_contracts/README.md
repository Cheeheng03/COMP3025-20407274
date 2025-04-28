# Smart Contract Development

This project contains smart contracts for the Web3 Wallet Credit Score system, including:
- `OnChainCreditScore.sol`: Main contract for storing credit scores
- `RunJob.sol`: Contract for running Chainlink jobs
- `Operator.sol`: Contract for operator management

## Project Structure

```
smart_contracts/
├── contracts/
│   ├── OnChainCreditScore.sol
│   ├── RunJob.sol
│   └── Operator.sol
├── scripts/
│   └── deploy.js
├── test/
│   ├── CreditScore.t.sol (Foundry tests)
│   └── Lock.js (Hardhat tests)
├── hardhat.config.js
└── foundry.toml
```

## Prerequisites

1. **Node.js and npm**
```bash
# Install Node.js (v16 or higher recommended)
# npm will be installed with Node.js
```

2. **Hardhat**
```bash
npm install --save-dev hardhat
```

3. **Foundry**
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Environment Configuration**
Create a `.env` file in the root directory:
```
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Hardhat Deployment

### Compile Contracts
```bash
npx hardhat compile
```

### Deploy to Sepolia Testnet
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Verify Contracts on Etherscan
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Foundry Testing

### Run Tests
```bash
forge test
```

### Run Specific Test
```bash
forge test --match-contract CreditScore
```

### Run Tests with Verbose Output
```bash
forge test -vv
```

### Gas Report
```bash
forge test --gas-report
```

## Contract Details

### OnChainCreditScore.sol
- Stores credit scores on-chain
- Allows updating scores
- Emits events for score updates
- Key functions:
  - `storeCreditScore(address, uint256)`
  - `getCreditScore(address)`

### RunJob.sol
- Handles Chainlink job execution
- Manages job requests and responses
- Key functions:
  - `requestCreditScore(address)`
  - `fulfillCreditScore(bytes32, uint256)`

### Operator.sol
- Manages operator permissions
- Controls access to critical functions
- Key functions:
  - `addOperator(address)`
  - `removeOperator(address)`

## Development Workflow

1. **Write Tests**
   - Create Foundry tests in `test/CreditScore.t.sol`
   - Create Hardhat tests in `test/Lock.js`

2. **Run Tests**
   ```bash
   # Foundry tests
   forge test
   
   # Hardhat tests
   npx hardhat test
   ```

3. **Deploy to Testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Verify Contracts**
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

## Common Issues and Solutions

1. **Compilation Errors**
   - Check Solidity version in contracts
   - Verify all imports are correct
   - Ensure all dependencies are installed

2. **Deployment Failures**
   - Verify private key and RPC URL
   - Check gas price and limits
   - Ensure sufficient testnet ETH

3. **Test Failures**
   - Check test environment setup
   - Verify mock data
   - Review test assertions
