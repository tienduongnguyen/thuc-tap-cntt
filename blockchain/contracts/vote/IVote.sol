// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct VoteInfo {
    bool voted;
    uint256 option;
    uint256 time;
}

interface IVote {
    function hashIdVote(string memory hashId) external view returns (VoteInfo memory);

    function hashIdOption(string memory hashId) external view returns (uint256);

    function voteByIndex(uint256 index) external view returns (VoteInfo memory);

    function hashIdByIndex(uint256 index) external view returns (string memory);

    function name() external view returns (string memory);

    function supply() external view returns (uint256);
}
