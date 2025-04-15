// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Chainlink, ChainlinkClient} from "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract RunJob is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = (1 * LINK_DIVISIBILITY) / 10;
    string public lastMemo;

    address public oracleAddress;

    struct Job {
        string jobId;
    }

    Job[] public jobs;

    event RequestEventListenerFulfilled(bytes32 indexed requestId, string memo);
    event JobAdded(uint256 jobIndex, string jobId);
    event JobRemoved(uint256 jobIndex);
    event JobUpdated(uint256 jobIndex, string newJobId);
    event OracleAddressUpdated(address newOracle);

    constructor(address _oracleAddress) ConfirmedOwner(msg.sender) {
        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789); 
        oracleAddress = _oracleAddress;
    }

    function addJob(string memory _jobId) external onlyOwner {
        jobs.push(Job(_jobId));
        emit JobAdded(jobs.length - 1, _jobId); 
    }

    function updateJob(uint256 _index, string memory _newJobId) external onlyOwner {
        require(_index < jobs.length, "Job index out of bounds");
        jobs[_index].jobId = _newJobId;
        emit JobUpdated(_index, _newJobId);
    }

    function removeJob(uint256 _index) external onlyOwner {
        require(_index < jobs.length, "Job index out of bounds");
        jobs[_index] = jobs[jobs.length - 1]; 
        jobs.pop();
        emit JobRemoved(_index);
    }

    function requestEventListener() public {
        for (uint256 i = 0; i < jobs.length; i++) {
            _sendChainlinkRequest(jobs[i].jobId);
        }
    }

    function _sendChainlinkRequest(string memory _jobId) internal {
        Chainlink.Request memory req = _buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillEventListener.selector
        );
        _sendChainlinkRequestTo(oracleAddress, req, ORACLE_PAYMENT);
    }

    function fulfillEventListener(bytes32 _requestId, string memory _memo) public recordChainlinkFulfillment(_requestId) {
        emit RequestEventListenerFulfilled(_requestId, _memo);
        lastMemo = _memo;
    }

    function updateOracleAddress(address newOracle) external onlyOwner {
        oracleAddress = newOracle;
        emit OracleAddressUpdated(newOracle);
    }

    function getChainlinkToken() public view returns (address) {
        return _chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function cancelRequest(bytes32 _requestId, uint256 _payment, bytes4 _callbackFunctionId, uint256 _expiration) public onlyOwner {
        _cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}