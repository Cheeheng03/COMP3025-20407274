// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OnChainCreditScore {
    // Structure to hold a credit score record.
    struct CreditRecord {
        uint256 creditScore;
        uint256 timestamp;
    }

    // Mapping from a wallet address to an array of credit records.
    mapping(address => CreditRecord[]) private records;

    // Events for logging actions.
    event CreditScoreStored(address indexed wallet, uint256 creditScore, uint256 timestamp);

    /// @notice Stores a credit score record for a given wallet.
    /// @param wallet The wallet address to associate the credit score with.
    /// @param creditScore The aggregated credit score.
    function storeCreditScore(address wallet, uint256 creditScore) external {
        CreditRecord memory record = CreditRecord({
            creditScore: creditScore,
            timestamp: block.timestamp
        });
        records[wallet].push(record);
        emit CreditScoreStored(wallet, creditScore, block.timestamp);
    }

    /// @notice Returns all credit score records for a given wallet address.
    /// @param wallet The wallet address for which to retrieve records.
    /// @return An array of CreditRecord structures.
    function getCreditScores(address wallet) external view returns (CreditRecord[] memory) {
        return records[wallet];
    }
}
