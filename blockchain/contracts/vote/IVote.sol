// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IVote {
    struct TheVote {
        string hashId;
        uint256 option;
        uint256 time;
    }

    function exists(string memory hashId) external view returns (bool);

    function hashIdOption(string memory hashId) external view returns (uint256);

    function supply() external view returns (uint256);

    function voteByIndex(uint256 index) external view returns (TheVote memory);

    function hashIdByIndex(uint256 index) external view returns (string memory);

    function optionByIndex(uint256 index) external view returns (uint256);
}
