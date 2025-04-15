// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/OnChainCreditScore.sol";

contract OnChainCreditScoreTest is Test {
    OnChainCreditScore credit;

    address wallet1 = address(0x1);

    function setUp() public {
        credit = new OnChainCreditScore();
    }

    function testStoreAndRetrieveCreditScore() public {
        credit.storeCreditScore(wallet1, 800);

        OnChainCreditScore.CreditRecord[] memory scores = credit.getCreditScores(wallet1);
        assertEq(scores.length, 1);
        assertEq(scores[0].creditScore, 800);
        assertEq(scores[0].timestamp, block.timestamp);
    }
}
